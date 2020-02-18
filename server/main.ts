import { Meteor } from 'meteor/meteor';
import { PackageServer } from 'meteor/peerlibrary:meteor-packages';

import './api/LatestPackages';

Meteor.startup(() => {
  PackageServer.startSyncing();
});
