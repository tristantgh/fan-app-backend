const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; // Let Render assign the correct port

// ✅ CORS setup for Netlify custom domain
const allowedOrigins = [
  'https://tristanfanapp.com',
  'https://www.tristanfanapp.com',
  'http://localhost:3000',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ✅ Stripe webhook parsing
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(bodyParser.json());

// ✅ Webhook route
app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      console.log(`✅ Checkout complete: ${event.data.object.id}`);
      break;
    case 'invoice.payment_succeeded':
      console.log(`✅ Payment succeeded: ${event.data.object.subscription}`);
      break;
    case 'invoice.payment_failed':
      console.log(`❌ Payment failed: ${event.data.object.subscription}`);
      break;
    case 'customer.subscription.deleted':
      console.log(`❌ Subscription canceled: ${event.data.object.id}`);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// ✅ Test route
app.get('/', (req, res) => {
  res.send('✅ Backend is live!');
});

// ✅ Signup route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      customer_email: email,
      success_url: 'https://tristanfanapp.com/download-app',
      cancel_url: 'https://tristanfanapp.com/cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

// ✅ Start server on correct port
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});