const express = require('express');
const { getDb } = require('../database/init');

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  const { topic, level, search } = req.query;
  let query = `
    SELECT q.*, t.name as topic_name, t.icon as topic_icon, t.color as topic_color
    FROM quizzes q
    LEFT JOIN topics t ON q.topic_id = t.id
    WHERE q.is_active = 1
  `;
  const params = [];
  if (topic) { query += ' AND q.topic_id = ?'; params.push(topic); }
  if (level) { query += ' AND q.level = ?'; params.push(level); }
  if (search) { query += ' AND q.title LIKE ?'; params.push(`%${search}%`); }
  query += ' ORDER BY q.created_at DESC';
  res.json(db.prepare(query).all(...params));
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const quiz = db.prepare(`
    SELECT q.*, t.name as topic_name, t.icon as topic_icon
    FROM quizzes q
    LEFT JOIN topics t ON q.topic_id = t.id
    WHERE q.id = ?
  `).get(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Không tìm thấy bài thi' });

  const questions = db.prepare(`
    SELECT id, question, option_a, option_b, option_c, option_d
    FROM questions WHERE quiz_id = ?
  `).all(req.params.id);

  res.json({ ...quiz, questions });
});

router.get('/:id/questions', (req, res) => {
  const db = getDb();
  const questions = db.prepare('SELECT * FROM questions WHERE quiz_id = ?').all(req.params.id);
  res.json(questions);
});

module.exports = router;
