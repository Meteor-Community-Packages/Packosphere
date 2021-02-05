import { Meteor } from 'meteor/meteor';

import Twitter, { AccessTokenOptions } from 'twitter';

const twitterOauth: AccessTokenOptions = Meteor.settings?.twitter;
let client: Twitter | null = null;

if (typeof twitterOauth !== 'undefined' && Object.keys(twitterOauth).length >= 4) {
  client = new Twitter(twitterOauth);
};

export const postTwitterStatus = async (text: string): Promise<void> => {
  if (client !== null) {
    text = text.replace(/(<)|(>)/g, '');
    try {
      await client.post('statuses/update', { status: text });
    } catch (error) {
      console.log(error);
    }
  }
};

export default client;
