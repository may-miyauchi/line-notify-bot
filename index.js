const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;
const TO_GROUP_ID = process.env.TO_GROUP_ID;  // e.g. 'Uxxxxxxxxxx' ← 今は個人ID予定

const app = express();
app.use(bodyParser.json());

app.post('/notify', async (req, res) => {
  const { date, site, content, cost, photoUrl, sheetUrl } = req.body;

  const message = 
    `📋 新しい作業日報が届きました！\n` +
    `日付：${date}\n` +
    `現場：${site}\n` +
    `作業内容：${content}\n` +
    `高速代・駐車場：${cost || 'なし'}\n` +
    (photoUrl ? `📷 写真：添付あり\n` : '') +
    (sheetUrl ? `🔗 スプレッドシート → ${sheetUrl}` : '');

  try {
    await axios.post('https://api.line.me/v2/bot/message/push', {
      to: TO_GROUP_ID,
      messages: [{ type: 'text', text: message }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
      }
    });

    res.status(200).send('通知送信OK');
  } catch (error) {
    console.error('送信エラー:', error.response?.data || error.message);
    res.status(500).send('通知エラー');
  }
});

app.post('/webhook', (req, res) => {
  const events = req.body.events;
  console.log("Webhook受信:", JSON.stringify(events, null, 2));

  if (events && events.length > 0) {
    const userId = events[0].source.userId;
    console.log("ユーザーID:", userId);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LINE通知Botサーバー起動中：ポート${PORT}`);
});
