import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { fetch } from 'meteor/fetch';
import { LatestPackages, QRecentlyPublishedPackages, QPackageSearch, QPackageInfo } from '../../../api';

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
    const pkg = LatestPackages.findOne({ packageName, 'readme.fullText': { $exists: false } }, { fields: { _id: 1, 'readme.url': 1 } });

    if (typeof pkg !== 'undefined' && typeof pkg.readme !== 'undefined' && typeof pkg.readme.url !== 'undefined') {
      const response = await fetch(pkg.readme.url);
      const fullText = await response.text();
      LatestPackages.update({ _id: pkg._id }, { $set: { 'readme.fullText': fullText } });

      return true;
    }

    return false;
  },
});

export { LatestPackages };
