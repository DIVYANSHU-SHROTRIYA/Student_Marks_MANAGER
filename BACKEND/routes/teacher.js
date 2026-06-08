const express=require('express');
const router =express.Router();
const User= require('../models/User');
const Student= require('../models/Student');
const {protect,teacherOnly}=require('../middleware/auth');
router.use(protect,teacherOnly);
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ rollNumber: 1 });
    const withVirtuals = students.map(s => s.toJSON());
    console.log('First student:', JSON.stringify(withVirtuals[0])); // debug
    res.json(withVirtuals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/students', async (req, res) => {
  const { name, username, password, rollNumber, className, subjects } = req.body;
  
  console.log('Request body:', req.body); 

  if (!name || !username || !password || !rollNumber || !className)
    return res.status(400).json({ message: 'Please fill all required fields' });

  try {
    const userExists = await User.findOne({ username });
    
    
    if (userExists)
      return res.status(400).json({ message: 'Username already taken' });

    const rollExists = await Student.findOne({ rollNumber });
    
    
    if (rollExists)
      return res.status(400).json({ message: 'Roll number already exists' });

    const user = await User.create({
      name, username, password, role: 'student'
    });
    console.log('User created:', user._id); // add this line

    const student = await Student.create({
      userId: user._id,
      name,
      rollNumber,
      class: className,
      subjects: subjects || []
    });
    console.log('Student created:', student._id); // add this line

    res.status(201).json({ message: 'Student added successfully', student });
  } catch (err) {
    console.error('FULL ERROR:', err); // add this line
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.put('/students/:id/marks', async (req, res) => {
  const { subjects } = req.body;

  if (!subjects || !Array.isArray(subjects))
    return res.status(400).json({ message: 'Subjects array is required' });

  try {
    const student = await Student.findById(req.params.id);
    if (!student)
      return res.status(404).json({ message: 'Student not found' });

    student.subjects = subjects;
    await student.save();

    res.json({ message: 'Marks updated successfully', student: student.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
 
// DELETE /api/teacher/students/:id — delete a student
router.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student)
      return res.status(404).json({ message: 'Student not found' });
 
    // Delete user account too
    await User.findByIdAndDelete(student.userId);
    await Student.findByIdAndDelete(req.params.id);
 
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
 
module.exports = router;
