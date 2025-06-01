require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;  // Use Render-assigned port if available

// Serve static files like signup.html
app.use(express.static('public'));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// CORS setup - allow requests from *your frontend app's* domain (update this as needed)
app.use(cors({
  origin: '*',  // For now, allow all origins (change to your frontend domain in production)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Stripe raw body parser for webhook endpoint
app.use('/webhook', bodyParser.raw({ type: 'application/json' }));

// Signup route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    res.json({ message: 'User created', user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Signup failed', details: err.message });
    }
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });

    res.json({ message: 'Login successful', userId: user.id });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// Stripe Checkout
app.post('/create-checkout-session', async (req, res) => {
  const { email } = req.body;
  try {
    const customer = await stripe.customers.create({ email });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: 'price_1RTd52Gh7jWmNjsScGXF3Wea', quantity: 1 }],
      customer: customer.id,
      success_url: `${process.env.FRONTEND_URL}/success.html`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: 'Checkout failed', details: err.message });
  }
});

// Stripe webhook
app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    pool.query(
      'UPDATE subscriptions SET stripe_subscription_id = $1 WHERE stripe_customer_id = $2',
      [subscriptionId, customerId],
      (err) => {
        if (err) {
          console.error('Error updating subscription:', err);
        }
      }
    );
  }

  res.json({ received: true });
});

app.listen(port, () => {
  console.log(`✅ Backend server running on port ${port}`);
});