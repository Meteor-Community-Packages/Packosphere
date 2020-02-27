import { WebClient } from '@slack/web-api';
import { Meteor } from 'meteor/meteor';

const botToken: string = Meteor.settings?.slack?.botToken;
let client: WebClient;

const CHANNEL = '#packages';

if (botToken) {
  client = new WebClient(botToken);
} else {
  throw new Meteor.Error(
    'NoToken',
    'It appears that you have not specified a slack token in settings.json',
  );
}

export const postToSlack = async (text: string, channel: string = CHANNEL) => {
  try {
    await client.chat.postMessage({
      channel,
      text,
    });
  } catch (error) {
    console.log(error);
  }
};

export default client;
