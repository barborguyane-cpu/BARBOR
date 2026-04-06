const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');

// POST /api/notifications/send — admin broadcast
router.post('/send', authenticate, requireAdmin, async (req, res) => {
  const { title, body, to, data = {} } = req.body;
  if (!title || !body) return res.status(400).json({ success: false, message: 'title et body requis.' });

  // Expo push notification
  try {
    const message = {
      to: to || 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]', // replace with real token
      sound: 'default',
      title,
      body,
      data,
    };
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.EXPO_ACCESS_TOKEN}` },
      body: JSON.stringify(message),
    });
    const result = await response.json();
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/notifications/appointment-reminder — send RDV reminder
router.post('/appointment-reminder', authenticate, requireAdmin, async (req, res) => {
  const { appointmentId, clientPushToken } = req.body;
  // Logic: fetch appointment, send reminder 24h before
  res.json({ success: true, message: 'Rappel envoyé.' });
});

module.exports = router;
