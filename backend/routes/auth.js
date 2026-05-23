const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../database/init');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'phatphap_secret';

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu' });

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Email không tồn tại' });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Mật khẩu không đúng' });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, SECRET, { expiresIn: '7d' });
  const { password: _, ...userInfo } = user;
  res.json({ token, user: userInfo });
});

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(400).json({ error: 'Email đã được sử dụng' });

  const hashed = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
  ).run(name, email, hashed);

  const user = db.prepare('SELECT id, name, email, role, xp, level_id FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user });
});

router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Chưa đăng nhập' });
  try {
    const decoded = jwt.verify(token, SECRET);
    const db = getDb();
    const user = db.prepare('SELECT id, name, email, role, xp, level_id, study_days, avatar, created_at FROM users WHERE id = ?').get(decoded.id);
    res.json(user);
  } catch {
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
});

module.exports = router;
