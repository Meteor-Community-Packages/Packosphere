import { Meteor } from 'meteor/meteor';
import { PackageServer, LatestPackage, Package } from 'meteor/peerlibrary:meteor-packages';
import { addLinks } from 'meteor/copleykj:grapher-link-executor';
import { Packages } from '../Packages';

const { LatestPackages } = PackageServer;

export interface ILatestPackageQueryResult extends LatestPackage {
  meta: Package
}

Meteor.startup(() => {
  addLinks(LatestPackages, {
    meta: {
      type: 'one',
      collection: Packages,
      field: 'packageName',
      foreignIdentityField: 'name',
    },
  });
});

const QRecentlyPublishedPackages = LatestPackages.createQuery<ILatestPackageQueryResult>('recentlyPublishedPackages', {
  published: 1,
  packageName: 1,
  description: 1,
  meta: {
    totalAdds: 1,
  },
  $options: {
    sort: {
      published: -1,
    },
    limit: 10,
  },
});

export { LatestPackages, QRecentlyPublishedPackages };
