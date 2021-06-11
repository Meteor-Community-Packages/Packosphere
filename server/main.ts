import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { PackageServer } from 'meteor/peerlibrary:meteor-packages';
import { onPageLoad } from 'meteor/server-render';
import { WebApp } from 'meteor/webapp';
import './modules/bots';
import './modules/accounts';
import './api';
import '../imports/ui/App';

// Tell Meteor to publish the meteor-developer email address so that fast render sends it with html
Accounts._defaultPublishFields.projection = { 'services.meteor-developer.emails.address': 1, ...Accounts._defaultPublishFields.projection };

Meteor.startup(() => {
  PackageServer.startSyncing();

  WebApp.addHtmlAttributeHook(() => ({ lang: 'en' }));
});

onPageLoad(sink => {
  if (Meteor.isProduction) {
    sink.appendToHead?.(`
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-K04B5BWGED"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-K04B5BWGED');
    </script>
    `);
  }
});
