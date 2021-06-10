import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { fetch } from 'meteor/fetch';
import { RepoInfo } from 'meteor/peerlibrary:meteor-packages';
import { Octokit } from '@octokit/rest';
import ParseGitHubUrl from 'parse-github-url';
import { Packages } from '../Packages';
import { LatestPackages, Versions, QRecentlyPublishedPackages, QPackageSearch, QPackageInfo } from '../../../api';

const MS_IN_1_DAY = 1000 * 24 * 60 * 60;

const GitHub = new Octokit({});

LatestPackages._ensureIndex({
  packageName: 'text',
  description: 'text',
  longDescription: 'text',
}, {
  weights: {
    packageName: 20,
  },
});

QPackageSearch.expose({
  firewall () {
    return true;
  },
});

QRecentlyPublishedPackages.expose({
  firewall () {
    return true;
  },
});

QPackageInfo.expose({
  firewall () {
    return true;
  },
});

Meteor.methods({
  async updateExternalPackageData (packageName: string, version: string | null = null) {
    check(packageName, String);
    check(version, Match.Maybe(String));
    let clientShouldFetch = false;
    const updateObj: { $set: { 'readme.fullText'?: string | null, lastFetched?: Date | null}} = { $set: {} };

    const pkg = LatestPackages.findOne({
      packageName,
    }, {
      fields: {
        _id: 1, packageName: 1, 'readme.url': 1, 'readme.fullText': 1, git: 1, lastFetched: 1, version: 1,
      },
    });

    const { owner, name: repo } = ParseGitHubUrl(pkg?.git ?? '') ?? { owner: null, name: null };

    if (typeof pkg !== 'undefined') {
      const versionDoc = Versions.findOne({
        packageName,
        version: version ?? pkg.version,
      }, {
        fields: {
          _id: 1,
          readme: 1,
        },
      });

      if (typeof versionDoc !== 'undefined' && typeof versionDoc.readme !== 'undefined' && typeof versionDoc.readme.fullText === 'undefined' && typeof versionDoc.readme.url !== 'undefined') {
        const response = await fetch(versionDoc.readme.url);
        if (response.status === 200) {
          const fullText = await response.text();
          Versions.update({ _id: versionDoc._id, version: versionDoc.version }, { $set: { 'readme.fullText': fullText.length > 0 ? fullText : null } });
          clientShouldFetch = true;
        }
      }

      if (pkg.lastFetched !== null && (typeof pkg.lastFetched === 'undefined' || (Date.now() - pkg.lastFetched.getTime() > MS_IN_1_DAY))) {
        if (owner !== null && repo !== null) {
          try {
            const { data } = await GitHub.repos.get({
              owner,
              repo,
            });

            Packages.update({ name: pkg.packageName }, { $set: { repoInfo: data as unknown as RepoInfo } });
            updateObj.$set.lastFetched = new Date();
            clientShouldFetch = true;
          } catch (error) {
            if (error.status === 404) {
              updateObj.$set.lastFetched = null;
            }
          }
        }
      }

      Object.keys(updateObj.$set).length > 0 && LatestPackages.update({ _id: pkg._id }, updateObj);
    }

    return clientShouldFetch;
  },
});

export { LatestPackages };
