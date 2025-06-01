require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 10000;

// Allow Netlify frontend
const allowedOrigins = [
  'https://tristanfanapp.com',
  'https://www.tristanfanapp.com',
  'http://localhost:3000',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// For Stripe webhook raw body parsing
app.use('/webhook', express.raw({ type: 'application/json' }));

// For normal JSON parsing (signup)
app.use(bodyParser.json());

// Stripe Webhook
app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('✅ Webhook received:', event.type);
  } catch (err) {
    console.error('❌ Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  res.json({ received: true });
});

// Signup Route - Create Checkout Session
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  console.log('🔎 Signup request received:', { email, password });

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      }],
      customer_email: email,
      success_url: 'https://tristanfanapp.com/download-app',
      cancel_url: 'https://tristanfanapp.com/cancel',
    });

    console.log('✅ Stripe session created:', session.id);
    res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('❌ Error creating checkout session:', err);
    res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running.');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server live on port ${PORT}`);
});