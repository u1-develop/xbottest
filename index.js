// index.js
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_SECRET,
});

const bot = client.readWrite;

let lastCheckedId = null;

async function checkMentions() {
  try {
    const mentions = await bot.v2.mentionsTimeline({
      since_id: lastCheckedId,
      max_results: 5,
    });

    for (const mention of mentions.data ?? []) {
      const text = mention.text.toLowerCase();
      const id = mention.id;
      const username = mention.author_id;

      console.log('🔔 Mention received:', text);

      if (text.includes('#GOアプリフリーAR')) {
        await bot.v2.reply(
          `@${mention.username} こちらをご覧ください 👉 https://www.vons.co.jp/ar/`,
          mention.id
        );
      }

      lastCheckedId = id;
    }
  } catch (err) {
    console.error('❌ Error checking mentions:', err);
  }
}

setInterval(checkMentions, 5000); // 5秒ごとにチェック
