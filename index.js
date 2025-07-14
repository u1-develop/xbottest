require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_SECRET,
});

const bot = client.readWrite;

let lastMentionId = null;

async function checkMentions() {
  try {
    const mentions = await bot.v1.mentionTimeline({ count: 5, since_id: lastMentionId });

    if (!mentions.length) {
      console.log('No new mentions');
      return;
    }

    for (const mention of mentions) {
      const text = mention.text.toLowerCase();
      const tweetId = mention.id_str;
      const screenName = mention.user.screen_name;

      console.log(`📩 Mention from @${screenName}: ${text}`);

      if (text.includes('#GOアプリフリーAR')) {
        await bot.v1.reply(
          `@${screenName} こちらをご覧ください 👉 https://www.vons.co.jp/ar/`,
          tweetId
        );
        console.log(`✅ Replied to @${screenName}`);
      }

      lastMentionId = tweetId;
    }
  } catch (err) {
    console.error('❌ Error checking mentions:', err);
  }
}

setInterval(checkMentions, 5000); // 5秒ごとにチェック
