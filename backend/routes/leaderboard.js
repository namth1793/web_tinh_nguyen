const express = require('express');
const { getDb } = require('../database/init');

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  const { period = 'total', limit = 10 } = req.query;
  const users = db.prepare(`
    SELECT u.id, u.name, u.avatar, u.xp, u.level_id,
           ROW_NUMBER() OVER (ORDER BY u.xp DESC) as rank
    FROM users u
    ORDER BY u.xp DESC
    LIMIT ?
  `).all(Number(limit));
  res.json(users);
});

router.get('/weekly', (req, res) => {
  const db = getDb();
  const users = db.prepare(`
    SELECT u.id, u.name, u.avatar,
           COALESCE(SUM(CASE WHEN r.passed = 1 THEN 50 ELSE 10 END), 0) as weekly_xp,
           ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(CASE WHEN r.passed = 1 THEN 50 ELSE 10 END), 0) DESC) as rank
    FROM users u
    LEFT JOIN quiz_results r ON u.id = r.user_id
      AND r.completed_at >= datetime('now', '-7 days')
    GROUP BY u.id
    ORDER BY weekly_xp DESC
    LIMIT 10
  `).all();
  res.json(users);
});

module.exports = router;
