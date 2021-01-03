import { PackageServer, Package, LatestPackage } from 'meteor/peerlibrary:meteor-packages';
import { addLinks } from 'meteor/copleykj:grapher-link-executor';
import { LatestPackages } from '../LatestPackages';

const { Packages } = PackageServer;

export interface IpackageQueryResult extends Package {
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


export { Packages };
