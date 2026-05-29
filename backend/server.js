const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 5030;

// Parse allowed origins from env var
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim().replace(/\/$/, ''))
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server requests (no origin header)
    if (!origin) return callback(null, true);
    // Dev mode: no CORS_ORIGIN set → allow all
    if (allowedOrigins.length === 0) return callback(null, true);
    // Check whitelist
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Handle OPTIONS preflight for every route FIRST
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());

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
  res.json({ status: 'OK', message: 'Phat Phap Test API is running' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  if (allowedOrigins.length > 0) {
    console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
  } else {
    console.log('CORS: dev mode — all origins allowed');
  }
});
