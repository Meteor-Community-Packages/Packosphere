import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

const configuration = Meteor.settings?.meteorDeveloper;

if (typeof configuration !== 'undefined') {
  Meteor.startup(() => ServiceConfiguration.configurations.upsert({ service: 'meteor-developer' }, { $set: configuration }));
}
