import { Meteor } from 'meteor/meteor';
import { fetch } from 'meteor/fetch';

let webhookUrl: string | null = null;

Meteor.startup(() => {
  const discordSettings = Meteor.settings?.discord as { webhookUrl?: string } | undefined;
  if (discordSettings?.webhookUrl) {
    webhookUrl = discordSettings.webhookUrl;
    console.log('Discord bot initialized');
  }
});

export const postToDiscord = async (text: string): Promise<void> => {
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text }),
    });
  } catch (error) {
    console.error('Discord post failed:', error);
  }
};
