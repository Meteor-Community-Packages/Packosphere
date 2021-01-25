import { LatestPackages, QRecentlyPublishedPackages, QPackageSearch } from '../../../api';

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

export { LatestPackages };
