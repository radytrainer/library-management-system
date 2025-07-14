const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      // 1. Get token from header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 3. Find user
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // 4. Attach user to request
      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Please authenticate' });
    }
  },

  authorize: (roles = []) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
  }
};