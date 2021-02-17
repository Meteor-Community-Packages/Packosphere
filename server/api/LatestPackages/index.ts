import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { fetch } from 'meteor/fetch';
import { RepoInfo } from 'meteor/peerlibrary:meteor-packages';
import { Octokit } from '@octokit/rest';
import ParseGitHubUrl from 'parse-github-url';
import { Packages } from '../Packages';
import { LatestPackages, QRecentlyPublishedPackages, QPackageSearch, QPackageInfo } from '../../../api';

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
  async updateExternalPackageData (packageName: string) {
    check(packageName, String);
    let clientShouldFetch = false;
    const updateObj: { $set: { 'readme.fullText'?: string | null, lastFetched?: Date | null}} = { $set: {} };

    const pkg = LatestPackages.findOne({
      packageName,
    }, {
      fields: {
        _id: 1, packageName: 1, 'readme.url': 1, 'readme.fullText': 1, git: 1, lastFetched: 1,
      },
    });

    const { owner, name: repo } = ParseGitHubUrl(pkg?.git ?? '') ?? { owner: null, name: null };

    if (typeof pkg !== 'undefined') {
      if (typeof pkg.readme !== 'undefined' && typeof pkg.readme?.fullText === 'undefined' && typeof pkg.readme.url !== 'undefined') {
        const response = await fetch(pkg.readme.url);
        const fullText = await response.text();
        updateObj.$set['readme.fullText'] = fullText.length > 0 ? fullText : null;
        clientShouldFetch = true;
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

      clientShouldFetch && LatestPackages.update({ _id: pkg._id }, updateObj);
    }

    return clientShouldFetch;
  },
});

export { LatestPackages };
