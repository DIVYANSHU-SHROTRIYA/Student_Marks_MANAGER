const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

const teacherOnly = (req, res, next) => {
  if (req.user.role !== 'teacher')
    return res.status(403).json({ message: 'Access denied. Teachers only.' });
  next();
};

const studentOnly = (req, res, next) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ message: 'Access denied. Students only.' });
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  next();
};

module.exports = { protect, teacherOnly, studentOnly, adminOnly };