// server.js
require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const bodyParser   = require('body-parser');
const stripe       = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bcrypt       = require('bcrypt');
const { Pool }     = require('pg');
const { Expo }     = require('expo-server-sdk');

const app   = express();
const expo  = new Expo();
const PORT  = process.env.PORT || 10000;

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
    if (!user.password_hash) throw new Error('No password set for this user');
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
    res.status(201).json(announcement);

    // 2) load all registered push tokens
    const { rows } = await pool.query(
      'SELECT push_token FROM users WHERE push_token IS NOT NULL'
    );
    const messages = [];
    for (let { push_token } of rows) {
      if (!Expo.isExpoPushToken(push_token)) {
        console.warn(`Skipping invalid token: ${push_token}`);
        continue;
      }
      messages.push({
        to: push_token,
        sound: 'default',
        title,
        body
      });
    }

    // 3) send in chunks
    for (let chunk of expo.chunkPushNotifications(messages)) {
      try {
        const receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log('Push receipts:', receipts);
      } catch (err) {
        console.error('Push error:', err);
      }
    }

  } catch (err) {
    console.error('❌ Create announcement error:', err);
    res.status(500).json({ error: 'Failed to create announcement.' });
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
    return res.sendStatus(200);
  } catch (err) {
    console.error('❌ Register token error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/', (_req, res) => res.send('Backend is running.'));

// Start server
app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));

// 1) List
app.get('/upcoming-shows', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, body, created_at FROM upcoming_shows ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Get upcoming shows error:', err);
    res.status(500).json({ error: 'Failed to fetch upcoming shows.' });
  }
});

// 2) Create
app.post('/upcoming-shows', ensureAdmin, async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'Title and body required.' });
  try {
    const result = await pool.query(
      'INSERT INTO upcoming_shows(title, body) VALUES($1, $2) RETURNING *',
      [title, body]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Create upcoming show error:', err);
    res.status(500).json({ error: 'Failed to create upcoming show.' });
  }
});

// 3) Update
app.put('/upcoming-shows/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  try {
    const result = await pool.query(
      'UPDATE upcoming_shows SET title = $1, body = $2 WHERE id = $3 RETURNING *',
      [title, body, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Update upcoming show error:', err);
    res.status(500).json({ error: 'Failed to update upcoming show.' });
  }
});

// 4) Delete
app.delete('/upcoming-shows/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM upcoming_shows WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Delete upcoming show error:', err);
    res.status(500).json({ error: 'Failed to delete upcoming show.' });
  }
});

// 1) List
app.get('/behind-the-scenes', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, body, created_at FROM behind_the_scenes ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Get behind the scenes error:', err);
    res.status(500).json({ error: 'Failed to fetch behind the scenes.' });
  }
});

// 2) Create
app.post('/behind-the-scenes', ensureAdmin, async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'Title and body required.' });
  try {
    const result = await pool.query(
      'INSERT INTO behind_the_scenes(title, body) VALUES($1, $2) RETURNING *',
      [title, body]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Create behind the scenes error:', err);
    res.status(500).json({ error: 'Failed to create behind the scenes.' });
  }
});

// 3) Update
app.put('/behind-the-scenes/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  try {
    const result = await pool.query(
      'UPDATE behind_the_scenes SET title = $1, body = $2 WHERE id = $3 RETURNING *',
      [title, body, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Update behind the scenes error:', err);
    res.status(500).json({ error: 'Failed to update behind the scenes.' });
  }
});

// 4) Delete
app.delete('/behind-the-scenes/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM behind_the_scenes WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Delete behind the scenes error:', err);
    res.status(500).json({ error: 'Failed to delete behind the scenes.' });
  }
});

// 1) List
app.get('/merch', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, body, created_at FROM merch ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Get merch error:', err);
    res.status(500).json({ error: 'Failed to fetch merch.' });
  }
});

// 2) Create
app.post('/merch', ensureAdmin, async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'Title and body required.' });
  try {
    const result = await pool.query(
      'INSERT INTO merch(title, body) VALUES($1, $2) RETURNING *',
      [title, body]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Create merch error:', err);
    res.status(500).json({ error: 'Failed to create merch.' });
  }
});

// 3) Update
app.put('/merch/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  try {
    const result = await pool.query(
      'UPDATE merch SET title = $1, body = $2 WHERE id = $3 RETURNING *',
      [title, body, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Update merch error:', err);
    res.status(500).json({ error: 'Failed to update merch.' });
  }
});

// 4) Delete
app.delete('/merch/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM merch WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Delete merch error:', err);
    res.status(500).json({ error: 'Failed to delete merch.' });
  }
});

// 1) List
app.get('/perks', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, body, created_at FROM perks ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Get perks error:', err);
    res.status(500).json({ error: 'Failed to fetch perks.' });
  }
});

// 2) Create
app.post('/perks', ensureAdmin, async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'Title and body required.' });
  try {
    const result = await pool.query(
      'INSERT INTO perks(title, body) VALUES($1, $2) RETURNING *',
      [title, body]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Create perks error:', err);
    res.status(500).json({ error: 'Failed to create perks.' });
  }
});

// 3) Update
app.put('/perks/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  try {
    const result = await pool.query(
      'UPDATE perks SET title = $1, body = $2 WHERE id = $3 RETURNING *',
      [title, body, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Update perks error:', err);
    res.status(500).json({ error: 'Failed to update perks.' });
  }
});

// 4) Delete
app.delete('/perks/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM perks WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Delete perks error:', err);
    res.status(500).json({ error: 'Failed to delete perks.' });
  }
});

// 1) List
app.get('/unreleased-music', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, body, created_at FROM unreleased_music ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Get unreleased music error:', err);
    res.status(500).json({ error: 'Failed to fetch unreleased music.' });
  }
});

// 2) Create
app.post('/unreleased-music', ensureAdmin, async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'Title and body required.' });
  try {
    const result = await pool.query(
      'INSERT INTO unreleased_music(title, body) VALUES($1, $2) RETURNING *',
      [title, body]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Create unreleased music error:', err);
    res.status(500).json({ error: 'Failed to create unreleased music.' });
  }
});

// 3) Update
app.put('/unreleased-music/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  try {
    const result = await pool.query(
      'UPDATE unreleased_music SET title = $1, body = $2 WHERE id = $3 RETURNING *',
      [title, body, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Update unreleased music error:', err);
    res.status(500).json({ error: 'Failed to update unreleased music.' });
  }
});

// 4) Delete
app.delete('/unreleased-music/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM unreleased_music WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Delete unreleased music error:', err);
    res.status(500).json({ error: 'Failed to delete unreleased music.' });
  }
});

// 1) List
app.get('/about', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, body, created_at FROM about ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Get about error:', err);
    res.status(500).json({ error: 'Failed to fetch about.' });
  }
});

// 2) Create
app.post('/about', ensureAdmin, async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'Title and body required.' });
  try {
    const result = await pool.query(
      'INSERT INTO about(title, body) VALUES($1, $2) RETURNING *',
      [title, body]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Create about error:', err);
    res.status(500).json({ error: 'Failed to create about.' });
  }
});

// 3) Update
app.put('/about/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  try {
    const result = await pool.query(
      'UPDATE about SET title = $1, body = $2 WHERE id = $3 RETURNING *',
      [title, body, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Update about error:', err);
    res.status(500).json({ error: 'Failed to update about.' });
  }
});

// 4) Delete
app.delete('/about/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM about WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Delete about error:', err);
    res.status(500).json({ error: 'Failed to delete about.' });
  }
});