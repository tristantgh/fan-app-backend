// server.js
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const stripe     = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bcrypt     = require('bcrypt');
const { Pool }   = require('pg');
const { Expo }   = require('expo-server-sdk');

const app  = express();
const PORT = process.env.PORT || 10000;
const expo = new Expo();

// PostgreSQL pool (Render DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// CORS for your frontend(s)
const allowedOrigins = [
  'https://tristanfanapp.com',
  'https://www.tristanfanapp.com',
  'http://localhost:3000',
];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Webhook needs raw body
app.use('/webhook', express.raw({ type: 'application/json' }));
// All other JSON
app.use(bodyParser.json());

/** Middleware: only allow admins */
async function ensureAdmin(req, res, next) {
  try {
    const auth  = req.headers.authorization || '';
    const token = auth.replace('Bearer ', '').trim();
    if (!token) return res.status(401).send('Unauthorized');

    const { rows } = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [token]
    );
    if (!rows[0] || rows[0].role !== 'admin') {
      return res.status(403).send('Forbidden');
    }
    next();
  } catch (err) {
    console.error('Auth error', err);
    res.status(500).send('Server error');
  }
}

/** Stripe Webhook (unchanged) */
app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, sig, process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('✅ Webhook received:', event.type);
  } catch (err) {
    console.error('❌ Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  res.json({ received: true });
});

/** Signup: hash password, insert user, then create Stripe session */
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users(email, password_hash) VALUES($1, $2) RETURNING id',
      [email, password_hash]
    );
    const userId = result.rows[0].id;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      customer_email: email,
      success_url: 'https://tristanfanapp.com/download-app',
      cancel_url:  'https://tristanfanapp.com/cancel',
      metadata:    { userId: String(userId) },
    });
    console.log('✅ Stripe session created:', session.id);
    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ error: 'Failed to create signup session.' });
  }
});

/** LOGIN: verify email/password, return userId + role */
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT id, password_hash, role FROM users WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid email or password.' });
    res.json({ userId: user.id, role: user.role });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

/** Public: list announcements */
app.get('/announcements', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, body, created_at FROM announcements ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Get announcements error:', err);
    res.status(500).json({ error: 'Failed to fetch announcements.' });
  }
});

/** Admin only: create announcement & broadcast push */
app.post('/announcements', ensureAdmin, async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required.' });
  }
  try {
    // 1) insert announcement
    const result = await pool.query(
      'INSERT INTO announcements(title, body) VALUES($1, $2) RETURNING *',
      [title, body]
    );
    const announcement = result.rows[0];

    // 2) send pushes
    const { rows: users } = await pool.query(
      'SELECT push_token FROM users WHERE push_token IS NOT NULL'
    );
    const messages = users
      .map(u => u.push_token)
      .filter(token => Expo.isExpoPushToken(token))
      .map(token => ({ to: token, sound: 'default', title, body }));

    for (let chunk of expo.chunkPushNotifications(messages)) {
      try {
        const receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log('Push receipts:', receipts);
      } catch (err) {
        console.error('Push error:', err);
      }
    }

    res.status(201).json(announcement);
  } catch (err) {
    console.error('❌ Create announcement error:', err);
    res.status(500).json({ error: 'Failed to create announcement.' });
  }
});

/** GET comments for a given announcement */
app.get('/announcements/:id/comments', async (req, res) => {
  const announcementId = parseInt(req.params.id, 10);
  try {
    const { rows } = await pool.query(
      `SELECT c.id,
              c.text,
              c.created_at,
              u.email AS user_email
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.announcement_id = $1
       ORDER BY c.created_at ASC`,
      [announcementId]
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Get comments error:', err);
    res.status(500).json({ error: 'Failed to fetch comments.' });
  }
});

/** POST a new comment on an announcement */
app.post('/announcements/:id/comments', async (req, res) => {
  const announcementId = parseInt(req.params.id, 10);
  const { userId, text } = req.body;
  if (!userId || !text) {
    return res.status(400).json({ error: 'Missing userId or text.' });
  }
  try {
    // 1) insert
    const insert = await pool.query(
      `INSERT INTO comments (announcement_id, user_id, text)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [announcementId, userId, text]
    );
    const newId = insert.rows[0].id;

    // 2) fetch with email
    const { rows } = await pool.query(
      `SELECT c.id,
              c.text,
              c.created_at,
              u.email AS user_email
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.id = $1`,
      [newId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('❌ Post comment error:', err);
    res.status(500).json({ error: 'Could not post your comment.' });
  }
});

/** Register Expo push token */
app.post('/register-token', async (req, res) => {
  console.log('🔔 hit /register-token', req.body);
  const { userId, token } = req.body;
  if (!userId || !token) {
    return res.status(400).json({ error: 'Missing userId or token.' });
  }
  try {
    await pool.query(
      'UPDATE users SET push_token = $1 WHERE id = $2',
      [token, userId]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Register token error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/', (_req, res) => res.send('Backend is running.'));

// Start server
app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));