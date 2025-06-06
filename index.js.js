app.post('/webhook', (req, res) => {
  const events = req.body.events;
  console.log("Webhook受信:", JSON.stringify(events, null, 2));

  if (events && events.length > 0) {
    const userId = events[0].source.userId;
    console.log("ユーザーID:", userId);
  }

  res.sendStatus(200);
});
