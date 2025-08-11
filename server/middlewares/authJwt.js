const jwt = require("jsonwebtoken");
const db = require("../models");
const authConfig = require("../config/auth.config.js");

const { User, Role } = db;

// ✅ Verify JWT token and attach user object with role to request
const verifyToken = async (req, res, next) => {
  try {
    console.log('Incoming Headers:', req.headers);

    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
      return res.status(403).json({ message: 'No token provided!' });
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7); // remove 'Bearer ' prefix
    }

    if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
      return res.status(401).json({
        message: 'Unauthorized! Malformed token.',
      });
    }

    const decoded = jwt.verify(token, authConfig.secret);
    console.log('✅ Decoded token:', decoded);

    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, as: 'Role', attributes: ['id', 'name', 'description'] }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized! User not found.' });
    }

    if (!user.Role) {
      return res.status(401).json({ message: 'Unauthorized! User has no associated role.' });
    }

    // ✅ Attach user and userId to request
    req.user = user;
    req.userId = user.id;
    req.user.role = user.Role.name;

    next();
  } catch (error) {
    console.error('❌ Token verification error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.', expiredAt: error.expiredAt });
    }

    return res.status(401).json({ message: 'Unauthorized!', error: error.message });
  }
};


// ✅ Check if user is Admin
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.role) {
    console.error("❌ No user data in isAdmin");
    return res.status(401).json({ message: "No user data available!" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Require Admin Role!" });
  }
  next();
};

// ✅ Check if user is Librarian
const isLibrarian = (req, res, next) => {
  if (!req.user || !req.user.role) {
    console.error("❌ No user data in isLibrarian");
    return res.status(401).json({ message: "No user data available!" });
  }
  if (req.user.role !== "librarian") {
    return res.status(403).json({ message: "Require Librarian Role!" });
  }
  next();
};

// ✅ Check if user is either Librarian or Admin
const isLibrarianOrAdmin = (req, res, next) => {
  if (!req.user || !req.user.role) {
    console.error("❌ No user data in isLibrarianOrAdmin");
    return res.status(401).json({ message: "No user data available!" });
  }

  if (!["admin", "librarian"].includes(req.user.role)) {
    return res.status(403).json({ message: "Only admins or librarians can create users" });
  }

  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isLibrarian,
  isLibrarianOrAdmin,
};
