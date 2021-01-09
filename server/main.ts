import { Meteor } from 'meteor/meteor';
import { PackageServer } from 'meteor/peerlibrary:meteor-packages';

import './modules/bots';
import './api';

Meteor.startup(() => {
  PackageServer.startSyncing();
});
