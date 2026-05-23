const express = require('express');
const { getDb } = require('../database/init');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, (req, res) => {
  const { quiz_id, score, correct_answers, total_questions, time_spent } = req.body;
  const db = getDb();
  const passed = score >= 60 ? 1 : 0;
  const result = db.prepare(
    'INSERT INTO quiz_results (user_id, quiz_id, score, correct_answers, total_questions, time_spent, passed) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, quiz_id, score, correct_answers, total_questions, time_spent, passed);

  // Update XP
  const xpGain = Math.floor(score * 0.5 + (passed ? 20 : 5));
  db.prepare('UPDATE users SET xp = xp + ? WHERE id = ?').run(xpGain, req.user.id);

  res.json({ id: result.lastInsertRowid, passed, xpGain });
});

router.get('/me', authMiddleware, (req, res) => {
  const db = getDb();
  const results = db.prepare(`
    SELECT r.*, q.title as quiz_title, q.level, t.name as topic_name
    FROM quiz_results r
    JOIN quizzes q ON r.quiz_id = q.id
    JOIN topics t ON q.topic_id = t.id
    WHERE r.user_id = ?
    ORDER BY r.completed_at DESC
    LIMIT 20
  `).all(req.user.id);
  res.json(results);
});

router.get('/stats/me', authMiddleware, (req, res) => {
  const db = getDb();
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total_quizzes,
      ROUND(AVG(score), 1) as avg_score,
      SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) as passed_count,
      SUM(correct_answers) as total_correct,
      SUM(total_questions) as total_questions
    FROM quiz_results WHERE user_id = ?
  `).get(req.user.id);

  const user = db.prepare('SELECT xp, study_days FROM users WHERE id = ?').get(req.user.id);
  const rank = db.prepare('SELECT COUNT(*) + 1 as rank FROM users WHERE xp > ?').get(user.xp).rank;
  const totalUsers = db.prepare('SELECT COUNT(*) as c FROM users').get().c;

  res.json({ ...stats, ...user, rank, totalUsers, rankPercentage: Math.round((rank / totalUsers) * 100) });
});

module.exports = router;
