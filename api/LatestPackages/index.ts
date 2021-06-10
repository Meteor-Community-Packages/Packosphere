import { Meteor } from 'meteor/meteor';
import { PackageServer, LatestPackage, Package, Version } from 'meteor/peerlibrary:meteor-packages';
import { addLinks } from 'meteor/copleykj:grapher-link-executor';
import { Packages } from '../Packages';
import { Versions, VersionsSchema } from '../Versions';
const { LatestPackages } = PackageServer;

LatestPackages.attachSchema(VersionsSchema);

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
  $filters: {
    unmigrated: { $exists: false },
  },
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
  meta: {
    repoInfo: {
      html_url: 1,
      forks_count: 1,
      open_issues: 1,
      watchers_count: 1,
      fork: 1,
      updated_at: 1,
      language: 1,
      stargazers_count: 1,
      license: {
        spdx_id: 1,
      },
    },
  },
  git: 1,
  versions: {
    $options: {
      sort: {
        version: -1,
      },
      limit: 15,
    },
    version: 1,
    readme: {
      fullText: 1,
    },
    published: 1,
  },
});

export {
  LatestPackages,
  QRecentlyPublishedPackages,
  QPackageSearch,
  QPackageInfo,
};
