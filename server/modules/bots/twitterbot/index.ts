import { Meteor } from 'meteor/meteor';
import { TwitterApi } from 'twitter-api-v2';

interface TwitterSettings {
  consumer_key: string
  consumer_secret: string
  access_token_key: string
  access_token_secret: string
}

const twitterSettings: TwitterSettings | undefined = Meteor.settings?.twitter;
let client: TwitterApi | null = null;

// Only initialize if all required tokens are present and non-empty
if (
  typeof twitterSettings !== 'undefined' &&
  twitterSettings.consumer_key &&
  twitterSettings.consumer_secret &&
  twitterSettings.access_token_key &&
  twitterSettings.access_token_secret
) {
  client = new TwitterApi({
    appKey: twitterSettings.consumer_key,
    appSecret: twitterSettings.consumer_secret,
    accessToken: twitterSettings.access_token_key,
    accessSecret: twitterSettings.access_token_secret,
  });
}

export const postTwitterStatus = async (text: string): Promise<void> => {
  if (client !== null) {
    text = text.replace(/(<)|(>)/g, '');
    try {
      await client.v2.tweet(text);
    } catch (error) {
      console.log('Twitter API error:', error);
    }
  }
};

export default client;
