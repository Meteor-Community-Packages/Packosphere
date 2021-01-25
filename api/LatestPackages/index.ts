import { Meteor } from 'meteor/meteor';
import { PackageServer, LatestPackage, Package } from 'meteor/peerlibrary:meteor-packages';
import { addLinks } from 'meteor/copleykj:grapher-link-executor';
import { Packages } from '../Packages';

const { LatestPackages } = PackageServer;

export interface ILatestPackagesQueryResult extends LatestPackage {
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

const QRecentlyPublishedPackages = LatestPackages.createQuery<ILatestPackagesQueryResult>('recentlyPublishedPackages', {
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

const QPackageSearch = LatestPackages.createQuery<ILatestPackagesQueryResult>('packageSearch', {
  $filters: {
    unmigrated: { $exists: false },
    $text: { $search: '' },
  },
  $filter: ({ filters, options, params }: any) => {
    if (typeof params.query !== 'undefined') {
      filters.$text.$search = params.query;
    }
  },
  $options: {
    sort: { score: { $meta: 'textScore' } },
    limit: 10,
  },
  $paginate: true,
  packageName: 1,
  published: 1,
  description: 1,
  meta: {
    totalAdds: 1,
  },
  score: { $meta: 'textScore' },
});

export { LatestPackages, QRecentlyPublishedPackages, QPackageSearch };
