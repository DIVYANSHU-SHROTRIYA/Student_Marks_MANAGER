const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Student = require('../models/Student');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

// ============ STATS ============
// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const students      = await Student.find();

    let passed = 0, failed = 0;
    students.forEach(s => {
      const pct = parseFloat(s.toJSON().percentage);
      if (pct >= 50) passed++;
      else failed++;
    });

    res.json({ totalTeachers, totalStudents, passed, failed });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ============ TEACHERS ============
// GET /api/admin/teachers
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/teachers
router.post('/teachers', async (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password)
    return res.status(400).json({ message: 'Please fill all fields' });
  try {
    const exists = await User.findOne({ username });
    if (exists)
      return res.status(400).json({ message: 'Username already taken' });
    const teacher = await User.create({ name, username, password, role: 'teacher' });
    res.status(201).json({ message: 'Teacher added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/teachers/:id
router.delete('/teachers/:id', async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id);
    if (!teacher)
      return res.status(404).json({ message: 'Teacher not found' });
    if (teacher.role !== 'teacher')
      return res.status(400).json({ message: 'User is not a teacher' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ============ STUDENTS ============
// GET /api/admin/students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ rollNumber: 1 });
    res.json(students.map(s => s.toJSON()));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/students/:id
router.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student)
      return res.status(404).json({ message: 'Student not found' });
    await User.findByIdAndDelete(student.userId);
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;