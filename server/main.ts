import { Meteor } from 'meteor/meteor';
import { PackageServer } from 'meteor/peerlibrary:meteor-packages';

import '../imports/server/modules/bots';

Meteor.startup(() => {
  PackageServer.startSyncing();
});
