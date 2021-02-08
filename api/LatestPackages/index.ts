import { Meteor } from 'meteor/meteor';
import { PackageServer, LatestPackage, Package, Version } from 'meteor/peerlibrary:meteor-packages';
import { addLinks } from 'meteor/copleykj:grapher-link-executor';
import { Packages } from '../Packages';
import { Versions } from '../Versions';

const { LatestPackages } = PackageServer;

export interface ILatestPackagesQueryResult extends LatestPackage {
  meta: Package
  versions: Version[]
}

Meteor.startup(() => {
  addLinks(LatestPackages, {
    meta: {
      type: 'one',
      collection: Packages,
      field: 'packageName',
      foreignIdentityField: 'name',
    },
    versions: {
      type: 'many',
      collection: Versions,
      field: 'packageName',
      foreignIdentityField: 'packageName',
    },
  });
});

const QRecentlyPublishedPackages = LatestPackages.createQuery<ILatestPackagesQueryResult>('recentlyPublishedPackages', {
  $filter: () => {},
  published: 1,
  packageName: 1,
  description: 1,
  meta: {
    totalAdds: 1,
    maintainers: 1,
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
    published: { $gte: new Date(Date.now() - (60 * 60 * 1000 * 24 * 365 * 5)) },
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
    maintainers: 1,
  },
  score: { $meta: 'textScore' },
});

const QPackageInfo = LatestPackages.createQuery<ILatestPackagesQueryResult>('packageInfo', {
  $filter: ({ filters, options, params }: any) => {
    if (typeof params.packageName !== 'undefined' && typeof params.username !== 'undefined') {
      filters.packageName = `${params.username !== 'meteor' ? `${params.username}:` : ''}${params.packageName}`;
    }
  },
  $options: {
    limit: 1,
  },
  packageName: 1,
  description: 1,
  longDescription: 1,
  version: 1,
  published: 1,
  readme: {
    fullText: 1,
  },
  versions: {
    $options: {
      sort: {
        version: -1,
      },
      limit: 5,
    },
    version: 1,
  },
});

export {
  LatestPackages,
  QRecentlyPublishedPackages,
  QPackageSearch,
  QPackageInfo,
};
