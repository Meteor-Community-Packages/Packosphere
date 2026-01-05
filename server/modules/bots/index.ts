import PersistentSettings from '../PersistentSettings';
import { LatestPackages } from '../../api/LatestPackages';
import { ReleaseVersions } from '../../api/ReleaseVersions';
import { PackageServer, ReleaseVersion } from 'meteor/peerlibrary:meteor-packages';
import { makePackosphereLink } from '../../../imports/utils';
import { postTwitterStatus } from './twitterbot';
import { postToSlack } from './slackbot';
import { postToDiscord } from './discordbot';
import { Meteor } from 'meteor/meteor';

interface BotSettings {
  lastAnnounceTime: Date
}
const ANNOUNCE_INTERVAL = 60 * 60 * 1000;
const Settings = new PersistentSettings<BotSettings>('bot-settings');

// Initialize settings asynchronously
Meteor.startup(async () => {
  const lastAnnounceTime = await Settings.get('lastAnnounceTime');
  if (lastAnnounceTime === undefined) {
    await Settings.set('lastAnnounceTime', new Date());
  }
});

const batchAnnouncePackageUpdates = async (): Promise<void> => {
  const lastUpdated = await Settings.get('lastAnnounceTime');
  const cursor = LatestPackages.find(
    { published: { $gte: lastUpdated } },
    { fields: { packageName: 1, version: 1 } },
  );

  let twitterText: string = '';
  let slackText: string = '';
  let discordText: string = '';

  const count = await cursor.countAsync();
  if (count > 0) {
    for await (const doc of cursor) {
      const { packageName, version } = doc;
      const twitterVersion = `${packageName}@${version}\n`;
      const slackVersion = `\`${packageName}@${version}\`\n`;
      const discordVersion = `\`${packageName}@${version}\`\n`;
      const link = `${makePackosphereLink(packageName)}\n\n`;
      twitterText += twitterVersion + link;
      slackText += slackVersion + link;
      discordText += discordVersion + link;
      if (twitterText.length > 160) {
        void postTwitterStatus(`New Package Releases:\n\n${twitterText}`);
        twitterText = '';
      }
    }

    if (twitterText.length > 0) {
      void postTwitterStatus(`New Package Releases:\n\n${twitterText}`);
    }
    void postToSlack(`New Package Releases:\n\n${slackText}`);
    void postToDiscord(`**New Package Releases**\n\n${discordText}`);
    await Settings.set('lastAnnounceTime', new Date());
  }
};

if (Meteor.isProduction) {
  PackageServer.runIfSyncFinished(async () => {
    const lastAnnounceTime = await Settings.get('lastAnnounceTime');
    if (lastAnnounceTime !== undefined) {
      await Settings.set('lastAnnounceTime', new Date());
    }

    Meteor.setInterval(() => {
      void batchAnnouncePackageUpdates();
    }, ANNOUNCE_INTERVAL);

    ReleaseVersions.after.insert(async (userId: string, doc: ReleaseVersion) => {
      const { track, version } = doc;
      if (track === 'METEOR') {
        const beginning = 'New Meteor Release: ';
        const slackText = `\`${track}@${version}\``;
        const twitterText = `${track}@${version}`;
        const discordText = `\`${track}@${version}\``;

        void postToSlack(beginning + slackText);
        void postTwitterStatus(beginning + twitterText);
        void postToDiscord(`**${beginning}${discordText}**`);
      }
    });

    ReleaseVersions.after.update(async function (this: { previous: ReleaseVersion }, userId: string, doc: ReleaseVersion) {
      const { track, version, recommended } = doc;

      const { recommended: previousRecommend } = this.previous;
      if (recommended !== previousRecommend && recommended) {
        const slackText = `\`${track}@${version}\``;
        const twitterText = `${track}@${version}`;
        const discordText = `\`${track}@${version}\``;

        const ending = ' is now a recommended release. \n\nTime to update your apps!';

        void postToSlack(slackText + ending);
        void postTwitterStatus(twitterText + ending);
        void postToDiscord(`**${discordText}**${ending}`);
      }
    });
  });
}
