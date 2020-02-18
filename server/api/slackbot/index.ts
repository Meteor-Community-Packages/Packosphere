import { WebClient } from '@slack/web-api';
import { Meteor } from 'meteor/meteor';

const botToken: string = Meteor.settings?.slack?.botToken;
const client = new WebClient(botToken);

const CHANNEL = '#packages';

if (!botToken) {
    throw new Meteor.Error('NoToken', 'It appears that you have not specified a slack token in settings.json');
}

export const postToSlack = async (text: string) => {
  try {
    await client.chat.postMessage({
      channel: CHANNEL,
      text,
    });
  } catch (error) {
    console.log(error);
  }
};

export default client;
