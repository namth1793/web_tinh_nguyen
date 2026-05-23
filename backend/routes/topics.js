const express = require('express');
const { getDb } = require('../database/init');

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.prepare('SELECT * FROM topics ORDER BY id').all());
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(req.params.id);
  if (!topic) return res.status(404).json({ error: 'Không tìm thấy chủ đề' });
  const quizzes = db.prepare('SELECT * FROM quizzes WHERE topic_id = ? AND is_active = 1').all(req.params.id);
  res.json({ ...topic, quizzes });
});

module.exports = router;
