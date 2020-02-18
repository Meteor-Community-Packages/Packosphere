import { Meteor } from 'meteor/meteor';

import Twitter, { AccessTokenOptions } from 'twitter';
import markdownToTweet from 'markdown-to-tweet';

const twitterOauth: AccessTokenOptions = Meteor.settings?.twitter;
let client: Twitter;

if (twitterOauth) {
  client = new Twitter(twitterOauth);
} else {
  throw new Meteor.Error(
    'NoTwitterSettings',
    'It seems you may have forgotten to specify your twitter keys in settings.json',
  );
}

export const postTwitterStatus = async (text: string) => {
  text = await markdownToTweet(text);
  text = text.replace(/(<)|(>)/g, '');
  try {
    await client.post('statuses/update', { status: text });
  } catch (error) {
    console.log(error);
  }
};

export default client;
