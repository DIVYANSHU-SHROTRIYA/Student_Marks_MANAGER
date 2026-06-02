const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect, studentOnly } = require('../middleware/auth');

// All routes require student login
router.use(protect, studentOnly);

// GET /api/student/result — get own marks, grade, percentage
router.get('/result', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student)
      return res.status(404).json({ message: 'Student record not found' });

    res.json({
      name:       student.name,
      rollNumber: student.rollNumber,
      class:      student.class,
      subjects:   student.subjects,
      percentage: student.percentage,
      grade:      student.grade
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;