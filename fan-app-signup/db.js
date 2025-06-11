const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'tristanhulsebos', // Your macOS username
  host: 'localhost',
  database: 'fan_app',
  password: '', // leave empty unless you set a password for Postgres
  port: 5432,
});

module.exports = pool;