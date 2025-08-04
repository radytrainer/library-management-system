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
      console.error('❌ No token provided in headers');
      return res.status(403).json({ message: 'No token provided!' });
    }

    // ✅ Support 'Bearer ' prefix
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    // ✅ Basic JWT format validation
    if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
      console.error('❌ Invalid token format:', token);
      return res.status(401).json({
        message: 'Unauthorized! Malformed token.',
        error: 'Token does not match JWT format (header.payload.signature).'
      });
    }

    console.log('🔐 Verifying token:', token.substring(0, 20) + '...');

    const decoded = jwt.verify(token, authConfig.secret);
    console.log('✅ Decoded token:', { id: decoded.id, role: decoded.role });

    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, as: 'Role', attributes: ['id', 'name', 'description'] }],
    });

    if (!user) {
      console.error(`❌ User not found for ID: ${decoded.id}`);
      return res.status(401).json({ message: 'Unauthorized! User not found.', userId: decoded.id });
    }

    if (!user.Role) {
      console.error(`❌ No Role associated with user ID: ${user.id}`);
      return res.status(401).json({ message: 'Unauthorized! User has no associated role.', userId: user.id });
    }

    // ✅ Attach user & role consistently
    req.user = user;
    req.user.role = user.Role.name; // <-- Always available now

    console.log('✅ User verified:', { id: user.id, role: req.user.role });

    next();
  } catch (error) {
    console.error('❌ Token verification error:', error.name, error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired. Please log in again.',
        expiredAt: error.expiredAt,
      });
    }

    return res.status(401).json({
      message: 'Unauthorized! Invalid token.',
      error: error.message,
    });
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
