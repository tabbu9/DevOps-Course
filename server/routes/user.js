const express = require('express');
const db = require('../db');
const router = express.Router();

// Middleware for auth (simplified)
const jwt = require('jsonwebtoken');
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
}

// Get user profile
router.get('/profile', auth, async (req, res) => {
  const [rows] = await db.query('SELECT id, email, name FROM users WHERE id = ?', [req.user.id]);
  const [completed] = await db.query('SELECT * FROM completions WHERE user_id = ?', [req.user.id]);
  res.json({ user: rows[0], completions: completed });
});

// Mark course as completed
router.post('/complete', auth, async (req, res) => {
  const { topic } = req.body;
  await db.query('INSERT IGNORE INTO completions (user_id, topic) VALUES (?, ?)', [req.user.id, topic]);
  res.json({ msg: 'Course marked as completed' });
});

// Store PDF info
router.post('/add-pdf', auth, async (req, res) => {
  const { path, name } = req.body;
  await db.query('INSERT INTO user_pdfs (user_id, path, name) VALUES (?, ?, ?)', [req.user.id, path, name]);
  res.json({ msg: 'PDF added' });
});

// Get PDFs
router.get('/pdfs', auth, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM user_pdfs WHERE user_id = ?', [req.user.id]);
  res.json(rows);
});

module.exports = router;