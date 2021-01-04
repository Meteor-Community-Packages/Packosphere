import { PackageServer, Package, LatestPackage } from 'meteor/peerlibrary:meteor-packages';
import { addLinks } from 'meteor/copleykj:grapher-link-executor';

import { LatestPackages } from '../LatestPackages';

const { Packages } = PackageServer;
export interface IPackageQueryResult extends Package {
  currentVersion: LatestPackage
}

addLinks(Packages, {
  currentVersion: {
    type: 'one',
    collection: LatestPackages,
    field: 'name',
    foreignIdentityField: 'packageName',
  },
});

Packages.createQuery<IPackageQueryResult>('recentlyPublishedPackages', {
  lastUpdated: 1,
  name: 1,
  $options: {
    sort: {
      lastUpdated: -1,
    },
    limit: 10,
  }
});

export { Packages };
