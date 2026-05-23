const express = require('express');
const { getDb } = require('../database/init');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.prepare('SELECT * FROM badges').all());
});

router.get('/me', authMiddleware, (req, res) => {
  const db = getDb();
  const badges = db.prepare(`
    SELECT b.*, ub.earned_at
    FROM badges b
    JOIN user_badges ub ON b.id = ub.badge_id
    WHERE ub.user_id = ?
    ORDER BY ub.earned_at DESC
  `).all(req.user.id);
  res.json(badges);
});

module.exports = router;
