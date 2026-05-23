const express = require('express');
const { getDb } = require('../database/init');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT id, name, email, avatar, xp, level_id, study_days, created_at FROM users WHERE id = ?').get(req.user.id);
  const badges = db.prepare('SELECT b.* FROM badges b JOIN user_badges ub ON b.id = ub.badge_id WHERE ub.user_id = ?').all(req.user.id);
  const rank = db.prepare('SELECT COUNT(*) + 1 as r FROM users WHERE xp > ?').get(user.xp).r;
  const stats = db.prepare('SELECT COUNT(*) as total, ROUND(AVG(score),1) as avg FROM quiz_results WHERE user_id = ?').get(req.user.id);
  res.json({ ...user, badges, rank, totalQuizzes: stats.total, avgScore: stats.avg });
});

router.put('/profile', authMiddleware, (req, res) => {
  const { name, avatar } = req.body;
  const db = getDb();
  db.prepare('UPDATE users SET name = ?, avatar = ? WHERE id = ?').run(name, avatar, req.user.id);
  res.json({ success: true });
});

// Admin endpoints
router.get('/', adminMiddleware, (req, res) => {
  const db = getDb();
  res.json(db.prepare('SELECT id, name, email, role, xp, level_id, study_days, created_at FROM users ORDER BY xp DESC').all());
});

module.exports = router;
