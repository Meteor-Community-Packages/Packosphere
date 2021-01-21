import { Meteor } from 'meteor/meteor';

import Twitter, { AccessTokenOptions } from 'twitter';

const twitterOauth: AccessTokenOptions = Meteor.settings?.twitter;
let client: Twitter;

if (typeof twitterOauth !== 'undefined' && Object.keys(twitterOauth).length >= 4) {
  client = new Twitter(twitterOauth);
} else {
  throw new Meteor.Error(
    'NoTwitterSettings',
    'It seems you may have missed one of the 4 required properties or have forgotten to specify your twitter access all together keys in settings.json',
  );
}

export const postTwitterStatus = async (text: string): Promise<void> => {
  text = text.replace(/(<)|(>)/g, '');
  try {
    await client.post('statuses/update', { status: text });
  } catch (error) {
    console.log(error);
  }
};

export default client;
