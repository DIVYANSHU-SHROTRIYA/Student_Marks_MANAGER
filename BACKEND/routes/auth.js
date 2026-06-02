const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Please provide username and password' });
  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: 'Invalid username or password' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid username or password' });
    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, username: user.username, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/setup-admin  — run once to create admin account
router.post('/setup-admin', async (req, res) => {
  try {
    const exists = await User.findOne({ role: 'admin' });
    if (exists)
      return res.status(400).json({ message: 'Admin account already exists' });
    await User.create({ name: 'Admin', username: 'admin', password: 'admin123', role: 'admin' });
    res.json({ message: 'Admin account created', username: 'admin', password: 'admin123' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/setup-teacher — run once to create default teacher
router.post('/setup-teacher', async (req, res) => {
  try {
    const exists = await User.findOne({ role: 'teacher' });
    if (exists)
      return res.status(400).json({ message: 'Teacher account already exists' });
    await User.create({ name: 'Teacher', username: 'teacher', password: 'teacher123', role: 'teacher' });
    res.json({ message: 'Teacher account created', username: 'teacher', password: 'teacher123' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;