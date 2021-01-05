import PersistentSettings from '../PersistentSettings';
import { LatestPackages } from '../../api/LatestPackages';
import { ReleaseVersions } from '../../api/ReleaseVersions';
import { PackageServer, LatestPackage, ReleaseVersion } from 'meteor/peerlibrary:meteor-packages';
import { makeAtmosphereLink } from '../../../imports/utils';
import { postTwitterStatus } from './twitterbot';
import { postToSlack } from './slackbot';
import { Meteor } from 'meteor/meteor';

interface BotSettings {
  lastAnnounceTime: Date
}
const ANNOUNCE_INTERVAL = 60 * 60 * 1000;
const Settings = new PersistentSettings<BotSettings>('bot-settings');

const batchAnnouncePackageUpdates = (): void => {
  const lastUpdated = Settings.get('lastAnnounceTime');
  const updatedPackages = LatestPackages.find(
    { published: { $gte: lastUpdated } },
    { fields: { packageName: 1, version: 1 } },
  );
  let twitterText: string = '';
  let slackText: string = '';

  if (updatedPackages.count() > 0) {
    updatedPackages.forEach((doc) => {
      const { packageName, version } = doc;
      const newText = `\`${packageName}@${version}\`\n${makeAtmosphereLink(packageName)}\n\n`;
      twitterText += newText;
      slackText += newText;
      if (twitterText.length > 160) {
        void postTwitterStatus(`New Package Releases:\n\n${twitterText}`);
        twitterText = '';
      }
    });

    if (twitterText.length > 0) {
      void postTwitterStatus(`New Package Releases:\n\n${twitterText}`);
    }
    void postToSlack(`New Package Releases:\n\n${slackText}`);
    Settings.set('lastAnnounceTime', new Date());
  }
};

if (Meteor.isProduction) {
  PackageServer.runIfSyncFinished(() => {
    if (typeof Settings.get('lastAnnounceTime') !== 'undefined') {
      Settings.set('lastAnnounceTime', new Date());
    }

    Meteor.setInterval(batchAnnouncePackageUpdates, ANNOUNCE_INTERVAL);

    LatestPackages.after.update((userId: string, doc: LatestPackage) => {
      const { packageName, lastUpdated, published } = doc;
      if (lastUpdated.getTime() !== published.getTime()) {
        const text = `Metadata Update: \`${packageName}\`\n\n${makeAtmosphereLink(packageName)}`;

        void postToSlack(text);
        void postTwitterStatus(text);
      }
    }, { fetchPrevious: false });

    ReleaseVersions.after.insert((userId: string, doc: ReleaseVersion) => {
      const { track, version } = doc;
      if (track === 'METEOR') {
        const text = `New Meteor Release: \`${track}@${version}\``;

        void postToSlack(text);
        void postTwitterStatus(text);
      }
    });

    ReleaseVersions.after.update(function (this: { previous: ReleaseVersion }, userId: string, doc: ReleaseVersion) {
      const { track, version, recommended } = doc;

      const { recommended: previousRecommend } = this.previous;
      if (recommended !== previousRecommend && recommended) {
        const text = `\`${track}@${version}\` is now a recommended release. 🎉 \n\nTime to update your apps!`;

        void postToSlack(text);
        void postTwitterStatus(text);
      }
    });
  });
}
