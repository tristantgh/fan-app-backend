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
const expo = new Expo();
const PORT = process.env.PORT || 10000;

// PostgreSQL pool (Render DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// CORS
const allowedOrigins = [
  'https://tristanfanapp.com',
  'https://www.tristanfanapp.com',
  'http://localhost:3000',
];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Raw for webhook, JSON elsewhere
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(bodyParser.json());

/** Auth middleware */
async function ensureAdmin(req, res, next) {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
    if (!token) return res.status(401).send('Unauthorized');
    const { rows } = await pool.query('SELECT role FROM users WHERE id=$1', [token]);
    if (!rows[0] || rows[0].role !== 'admin') return res.status(403).send('Forbidden');
    next();
  } catch (err) {
    console.error('Auth error', err);
    res.status(500).send('Server error');
  }
}

/** Stripe webhook (unchanged) */
app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(
      req.body, sig, process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('✅ Webhook received:', event.type);
    res.json({ received: true });
  } catch (err) {
    console.error('❌ Webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

/** Signup, login, announcements, etc... (keep all your existing routes here) **/

/** COMMENTS: */
// GET comments for one announcement
app.get('/announcements/:id/comments', async (req, res) => {
  const annId = req.params.id;
  try {
    const { rows } = await pool.query(
      `SELECT c.id, u.email AS user_email, c.text, c.created_at
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.announcement_id = $1
       ORDER BY c.created_at ASC`,
      [annId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get comments error', err);
    res.status(500).json({ error: 'Failed to load comments.' });
  }
});

// POST a new comment
app.post('/announcements/:id/comments', async (req, res) => {
  const annId  = req.params.id;
  const { userId, text } = req.body;
  if (!userId || !text) return res.status(400).json({ error: 'Missing userId or text.' });

  try {
    const result = await pool.query(
      `INSERT INTO comments (announcement_id, user_id, text)
       VALUES ($1, $2, $3)
       RETURNING id, text, created_at`,
      [annId, userId, text]
    );
    const comment = result.rows[0];
    // grab the email
    const { rows: urows } = await pool.query(
      'SELECT email FROM users WHERE id = $1',
      [userId]
    );
    res.json({
      id: comment.id,
      user_email: urows[0]?.email || null,
      text: comment.text,
      created_at: comment.created_at
    });
  } catch (err) {
    console.error('Post comment error', err);
    res.status(500).json({ error: 'Failed to post comment.' });
  }
});

/** Health check */
app.get('/', (_req, res) => res.send('Backend is running.'));

/** Start */
app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));