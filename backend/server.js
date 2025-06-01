const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow Netlify frontend and local testing
const allowedOrigins = [
  'https://683be6b0572570d272286297--sweet-sorbet-c5c4cb.netlify.app',
  'http://localhost:3000', // Optional: if you test locally
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(bodyParser.json());

// Test route to check server status
app.get('/', (req, res) => {
  res.send('Server is live!');
});

// Signup route
app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Normally you'd save the user to a database here
  res.status(201).json({ message: 'User signed up successfully!' });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Normally you'd check credentials in DB here
  res.status(200).json({ message: 'User logged in successfully!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});