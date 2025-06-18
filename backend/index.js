// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const Stripe = require('stripe');

// —— Stripe client instantiation ——
// Make sure you have STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in your .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const app = express();
const port = process.env.PORT || 3000;  // Render will override this

// Serve signup.html, success.html, cancel.html, etc.
app.use(express.static('public'));

// Parse JSON bodies (for all non-webhook routes)
app.use(express.json());

// CORS – adjust origin for production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// For Stripe webhooks we need the raw body
app.post('/webhook', bodyParser.raw({ type: 'application/json' }));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ——— SIGNUP ———
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (email, password)
       VALUES ($1, $2)
       RETURNING id, email`,
      [email, hashed]
    );
    res.json({ message: 'User created', user: rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Signup failed', details: err.message });
    }
  }
});

// ——— LOGIN ———
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query(
      `SELECT id, email, password
       FROM users
       WHERE email = $1`,
      [email]
    );
    const user = rows[0];
    if (!user) return res.status(400).json({ error: 'User not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid password' });

    res.json({ message: 'Login successful', userId: user.id });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// ——— CREATE CHECKOUT SESSION ———
app.post('/create-checkout-session', async (req, res) => {
  const { email } = req.body;
  try {
    const customer = await stripe.customers.create({ email });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      customer: customer.id,
      success_url: `${process.env.FRONTEND_URL}/success.html`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: 'Checkout failed', details: err.message });
  }
});

// ——— WEBHOOK HANDLER ———
app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    pool.query(
      `UPDATE subscriptions
       SET stripe_subscription_id = $1
       WHERE stripe_customer_id = $2`,
      [session.subscription, session.customer],
      (dbErr) => {
        if (dbErr) console.error('Error updating subscription:', dbErr);
      }
    );
  }

  res.json({ received: true });
});

// ——— START SERVER ———
app.listen(port, () => {
  console.log(`✅ Backend server running on port ${port}`);
});