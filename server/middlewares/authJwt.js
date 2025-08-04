const jwt = require("jsonwebtoken");
const db = require("../models");
const authConfig = require("../config/auth.config.js");

const { User, Role } = db;

// Verify JWT token and attach userId and userRole to request
const verifyToken = async (req, res, next) => {
  try {
    // 🔍 Log incoming headers to debug
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

    req.userId = decoded.id;

    const user = await User.findByPk(req.userId, {
      include: [{ model: Role, as: 'Role', attributes: ['id', 'name', 'description'] }],
    });

    if (!user) {
      console.error(`❌ User not found for ID: ${req.userId}`);
      return res.status(401).json({ message: 'Unauthorized! User not found.', userId: req.userId });
    }

    if (!user.Role) {
      console.error(`❌ No Role associated with user ID: ${req.userId}`);
      return res.status(401).json({ message: 'Unauthorized! User has no associated role.', userId: req.userId });
    }

    req.user = user;
    req.userRole = user.Role.name;

    console.log('✅ User verified:', { id: user.id, role: req.userRole });

    next();
  } catch (error) {
    console.error('❌ Token verification error:', error.name, error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired. Please log in again.',
        expiredAt: error.expiredAt,
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Unauthorized! Invalid token.',
        error: error.message,
      });
    }

    return res.status(401).json({
      message: 'Unauthorized! Invalid token.',
      error: error.message,
    });
  }
};


// Check if user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      console.error("No user object in isAdmin");
      return res.status(401).json({ message: "No user data available!" });
    }
    if (!user.Role || user.Role.name !== "admin") {
      return res.status(403).json({ message: "Require Admin Role!" });
    }
    next();
  } catch (error) {
    console.error("Admin role check error:", error);
    res.status(500).json({ message: "Server error during role check." });
  }
};

// Check if user is a librarian
const isLibrarian = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      console.error("No user object in isLibrarian");
      return res.status(401).json({ message: "No user data available!" });
    }
    if (!user.Role || user.Role.name !== "librarian") {
      return res.status(403).json({ message: "Require Librarian Role!" });
    }
    next();
  } catch (error) {
    console.error("Librarian role check error:", error);
    res.status(500).json({ message: "Server error during role check." });
  }
};

// Check if user is either librarian or admin
const isLibrarianOrAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      console.error("No user object in isLibrarianOrAdmin");
      return res.status(401).json({ message: "No user data available!" });
    }
    if (!user.Role || !["admin", "librarian"].includes(user.Role.name)) {
      return res.status(403).json({ message: "Require Librarian or Admin Role!" });
    }
    next();
  } catch (error) {
    console.error("LibrarianOrAdmin role check error:", error);
    res.status(500).json({ message: "Server error during role check." });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isLibrarian,
  isLibrarianOrAdmin,
};