import { PackageServer, LatestPackage, ReleaseVersion } from 'meteor/peerlibrary:meteor-packages';
import { postToSlack } from '../slackbot';
import { postTwitterStatus } from '../twitterbot';

const { LatestPackages, Versions, ReleaseVersions } = PackageServer;

const makeAtmosphereLink = (packageName: string) => {
  return `https://atmospherejs.com/${packageName.replace(':', '/')}`;
};

PackageServer.runIfSyncFinished(() => {
  LatestPackages.after.insert(async (userId: string, doc: LatestPackage ) => {
    const { packageName, version } = doc;
    let text = Versions.find({ packageName }).count() === 1 ? 'New Package' : 'New Version';

    text = `${text} - \`${packageName}@${version}\`\n\n${makeAtmosphereLink(packageName)}`;

    postToSlack(text);
    postTwitterStatus(text);
  });

  LatestPackages.after.update(async (userId: string, doc: LatestPackage) => {
    const { packageName, lastUpdated, published } = doc;
    if (lastUpdated.getTime() !== published.getTime()) {
      const text = `Metadata Update - \`${packageName}\`\n\n${makeAtmosphereLink(packageName)}`;

      postToSlack(text);
      postTwitterStatus(text);
    }
  }, {fetchPrevious: false});

  ReleaseVersions.after.insert(async (userId: string, doc: ReleaseVersion) => {
    const { track, version } = doc;
    if (track === 'METEOR') {
      const text = `New Meteor Release - \`${track}@${version}\``;

      postToSlack(text);
      postTwitterStatus(text);
    }
  });

  ReleaseVersions.after.update(
    async function(this: { previous: ReleaseVersion }, userId: string, doc: ReleaseVersion) {
    const { track, version, recommended} = doc;

    const { recommended: previousRecommend } = this.previous as ReleaseVersion;
    if (recommended !== previousRecommend && recommended === true) {
      const text = `\`${track}@${version}\` is now a recommended release. 🎉`;

      postToSlack(text);
      postTwitterStatus(text);
    }
  });
});

export { LatestPackages };
