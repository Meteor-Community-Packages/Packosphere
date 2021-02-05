import { WebClient } from '@slack/web-api';
import { Meteor } from 'meteor/meteor';

const botToken: string = Meteor.settings?.slack?.botToken;
let client: WebClient | null = null;

const CHANNEL = '#packages';

if (typeof botToken !== 'undefined' && botToken.length !== 0) {
  client = new WebClient(botToken);
}

export const postToSlack = async (text: string, channel: string = CHANNEL): Promise<void> => {
  if (client !== null) {
    try {
      await client.chat.postMessage({
        channel,
        text,
      });
    } catch (error) {
      console.log(error);
    }
  }
};

export default client;
