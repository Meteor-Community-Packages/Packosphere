import { PackageServer, Package, LatestPackage } from 'meteor/peerlibrary:meteor-packages';
import { addLinks } from 'meteor/copleykj:grapher-link-executor';

import { LatestPackages } from '../LatestPackages';
import { Meteor } from 'meteor/meteor';

const { Packages } = PackageServer;
export interface IPackageQueryResult extends Package {
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

export { Packages };
