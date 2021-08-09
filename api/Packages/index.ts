import { PackageServer, Package, LatestPackage } from 'meteor/peerlibrary:meteor-packages';
import { addLinks } from 'meteor/copleykj:grapher-link-executor';

import SimpleSchema from 'simpl-schema';

import { LatestPackages } from '../LatestPackages';
import { Meteor } from 'meteor/meteor';

const { Packages } = PackageServer;

const PackagesSchema = new SimpleSchema({
  name: String,
  maintainers: Array,
  'maintainers.$': new SimpleSchema({
    username: String,
    id: String,
  }),
  homepage: {
    type: String,
    optional: true,
  },
  lastUpdated: Date,
  directAdds: SimpleSchema.Integer,
  totalAdds: SimpleSchema.Integer,
  repoInfo: new SimpleSchema({
    html_url: String,
    forks_count: Number,
    open_issues: Number,
    watchers_count: Number,
    language: String,
    pushed_at: Date,
    stargazers_count: Number,
    license: {
      type: new SimpleSchema({
        spdx_id: String,
      }),
      optional: true,
    },
  }),
});

Packages.attachSchema(PackagesSchema);
export interface IPackagesQueryResult extends Package {
  currentVersion: LatestPackage
}
Meteor.startup(() => {
  addLinks(Packages, {
    currentVersion: {
      type: 'one',
      collection: LatestPackages,
      field: 'name',
      foreignIdentityField: 'packageName',
    },
  });
});

const QPackagesByMaintainer = Packages.createQuery<IPackagesQueryResult>('packagesByMaintainer', {
  $filter: ({ filters, options, params }: any) => {
    if (typeof params.maintainer !== 'undefined') {
      filters['maintainers.username'] = params.maintainer;
    }
  },
  $options: {
    sort: { lastUpdated: -1 },
  },
  currentVersion: {
    unmigrated: 1,
    packageName: 1,
    version: 1,
    description: 1,
    published: 1,
  },
  maintainers: 1,
  name: 1,
  totalAdds: 1,
});

export { Packages, QPackagesByMaintainer };
