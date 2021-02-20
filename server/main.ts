import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { PackageServer } from 'meteor/peerlibrary:meteor-packages';

import './modules/bots';
import './modules/accounts';
import './api';

// Tell Meteor to publish the meteor-developer email address so that fast render sends it with html
Accounts._defaultPublishFields.projection = { 'services.meteor-developer.emails.address': 1, ...Accounts._defaultPublishFields.projection };

Meteor.startup(() => {
  PackageServer.startSyncing();
});
