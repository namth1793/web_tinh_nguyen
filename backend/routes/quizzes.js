const express = require('express');
const { getDb } = require('../database/init');
const { adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────────

router.get('/', (req, res) => {
  const db = getDb();
  const { topic, level, search } = req.query;
  let query = `
    SELECT q.*, t.name as topic_name, t.icon as topic_icon, t.color as topic_color,
           (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) as question_count
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
    SELECT q.*, t.name as topic_name, t.icon as topic_icon, t.color as topic_color
    FROM quizzes q
    LEFT JOIN topics t ON q.topic_id = t.id
    WHERE q.id = ?
  `).get(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Không tìm thấy bài thi' });

  const questions = db.prepare(`
    SELECT id, question, option_a, option_b, option_c, option_d
    FROM questions WHERE quiz_id = ? ORDER BY id
  `).all(req.params.id);

  res.json({ ...quiz, questions });
});

router.get('/:id/questions', (req, res) => {
  const db = getDb();
  const questions = db.prepare('SELECT * FROM questions WHERE quiz_id = ? ORDER BY id').all(req.params.id);
  res.json(questions);
});

// ── Admin routes ──────────────────────────────────────────────────────────────

// Create quiz
router.post('/', (req, res) => {
  const db = getDb();
  const { title, description, topic_id, level, time_limit, quiz_type } = req.body;
  if (!title) return res.status(400).json({ error: 'Tên bài thi là bắt buộc' });

  const result = db.prepare(`
    INSERT INTO quizzes (title, description, topic_id, level, quiz_type, question_count, time_limit, is_active)
    VALUES (?, ?, ?, ?, ?, 0, ?, 1)
  `).run(title, description || null, topic_id || null, level || 'Cơ bản', quiz_type || 'trac_nghiem', time_limit || 15);

  const newQuiz = db.prepare(`
    SELECT q.*, t.name as topic_name, t.icon as topic_icon, t.color as topic_color,
           (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) as question_count
    FROM quizzes q LEFT JOIN topics t ON q.topic_id = t.id
    WHERE q.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(newQuiz);
});

// Update quiz metadata
router.put('/:id', (req, res) => {
  const db = getDb();
  const { title, description, topic_id, level, time_limit, quiz_type } = req.body;
  if (!title) return res.status(400).json({ error: 'Tên bài thi là bắt buộc' });

  const existing = db.prepare('SELECT id FROM quizzes WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Không tìm thấy bài thi' });

  db.prepare(`
    UPDATE quizzes SET title=?, description=?, topic_id=?, level=?, quiz_type=?, time_limit=?
    WHERE id=?
  `).run(title, description || null, topic_id || null, level || 'Cơ bản', quiz_type || 'trac_nghiem', time_limit || 15, req.params.id);

  const updated = db.prepare(`
    SELECT q.*, t.name as topic_name, t.icon as topic_icon, t.color as topic_color,
           (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) as question_count
    FROM quizzes q LEFT JOIN topics t ON q.topic_id = t.id
    WHERE q.id = ?
  `).get(req.params.id);

  res.json(updated);
});

// Soft-delete quiz
router.delete('/:id', (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM quizzes WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Không tìm thấy bài thi' });

  db.prepare('UPDATE quizzes SET is_active = 0 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Bulk replace questions for a quiz
router.put('/:id/questions', (req, res) => {
  const db = getDb();
  const quizId = req.params.id;
  const questions = req.body.questions;

  const existing = db.prepare('SELECT id FROM quizzes WHERE id = ?').get(quizId);
  if (!existing) return res.status(404).json({ error: 'Không tìm thấy bài thi' });

  if (!Array.isArray(questions)) return res.status(400).json({ error: 'questions phải là mảng' });

  const upsert = db.transaction(() => {
    // Delete all existing questions for this quiz
    db.prepare('DELETE FROM questions WHERE quiz_id = ?').run(quizId);

    // Insert new questions
    const insert = db.prepare(`
      INSERT INTO questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const q of questions) {
      insert.run(
        quizId,
        q.question,
        q.option_a || '',
        q.option_b || '',
        q.option_c || '',
        q.option_d || '',
        q.correct_answer ?? 0,
        q.explanation || null,
      );
    }

    // Update question_count on the quiz
    db.prepare('UPDATE quizzes SET question_count = ? WHERE id = ?').run(questions.length, quizId);
  });

  upsert();

  const saved = db.prepare('SELECT * FROM questions WHERE quiz_id = ? ORDER BY id').all(quizId);
  res.json({ success: true, questions: saved });
});

module.exports = router;
