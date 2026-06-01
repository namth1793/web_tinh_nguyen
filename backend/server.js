const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 5030;

// Always-allowed origins (production domains + dev)
const STATIC_ORIGINS = [
  'https://phaphaptest.org',
  'https://www.phaphaptest.org',
  'http://localhost:3000',
  'http://localhost:3030',
];

// Additional origins from env var (optional)
const envOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim().replace(/\/$/, ''))
  : [];

const allowedOrigins = [...new Set([...STATIC_ORIGINS, ...envOrigins])];

// Manual CORS headers middleware — runs before everything else
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', origin); // still set it, let browser decide
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');

  // Respond immediately to preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use(express.json());

// Disable caching for all API responses
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  next();
});

// Init DB on startup
initDatabase();

// Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/quizzes',     require('./routes/quizzes'));
app.use('/api/results',     require('./routes/results'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/badges',      require('./routes/badges'));
app.use('/api/topics',      require('./routes/topics'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Phat Phap Test API is running', allowedOrigins });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`CORS allowed: ${allowedOrigins.join(', ')}`);
});
