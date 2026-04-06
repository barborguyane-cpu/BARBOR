const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// POST /api/payments/create-intent — create Stripe PaymentIntent
router.post('/create-intent', authenticate, async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { amount, currency = 'eur', description, metadata = {} } = req.body;
    if (!amount || amount < 50) {
      return res.status(400).json({ success: false, message: 'Montant invalide (minimum 0.50€).' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe works in cents
      currency,
      description,
      metadata: { ...metadata, clientId: req.user.id },
      automatic_payment_methods: { enabled: true },
    });
    res.json({ success: true, data: { clientSecret: paymentIntent.client_secret, id: paymentIntent.id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/payments/webhook — Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('Payment succeeded:', event.data.object.id);
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
  }
  res.json({ received: true });
});

module.exports = router;
