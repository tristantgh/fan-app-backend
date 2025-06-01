// server.js (Backend)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const customer = await stripe.customers.create({ email });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: process.env.STRIPE_PRICE_ID, // 👈 Make sure this is your Stripe Price ID (e.g., price_123...)
        quantity: 1,
      }],
      customer: customer.id,
      success_url: 'https://your-static-site-url/success',
      cancel_url: 'https://your-static-site-url/cancel',
    });

    await pool.query(
      'INSERT INTO users (email, password, stripe_customer_id, subscription_id) VALUES ($1, $2, $3, $4)',
      [email, password, customer.id, session.subscription]
    );

    res.json({ checkoutUrl: session.url });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));