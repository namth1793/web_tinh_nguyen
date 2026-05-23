const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 5030;

// CORS: allow specific origin in production, all in development
const corsOrigin = process.env.CORS_ORIGIN;
app.use(cors({
  origin: corsOrigin ? corsOrigin.split(',').map(s => s.trim()) : '*',
  credentials: true,
}));

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
});
