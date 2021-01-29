import { Meteor } from 'meteor/meteor';
import { PackageServer } from 'meteor/peerlibrary:meteor-packages';

import './modules/bots';
import './modules/accounts';
import './api';

Meteor.startup(() => {
  Meteor.publish(null, function () {
    if (this.userId !== null) {
      return Meteor.users.find(
        { _id: this.userId },
        {
          fields: {
            'services.meteor-developer.emails.address': 1,
          },
        });
    } else {
      return this.ready();
    }
  }, { is_auto: true });

  PackageServer.startSyncing();
});
