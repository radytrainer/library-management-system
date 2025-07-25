const jwt = require("jsonwebtoken");
const db = require("../models");
const authConfig = require("../config/auth.config.js");

const { User, Role } = db;

// Verify JWT token and attach userId to request
const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
      return res.status(403).json({ message: "No token provided!" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    const decoded = jwt.verify(token, authConfig.secret);
    req.userId = decoded.id;

    const user = await User.findByPk(req.userId, {
      include: [{ model: Role, as: "Role", attributes: ["id", "name", "description"] }],
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found." });
    }

    req.user = user;                     // Optional: full user object
    req.userRole = user.Role?.name || "user"; // 👈 Add this line
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized! Invalid token." });
  }
};
// Check if user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const user = req.user; // Use user attached by verifyToken
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
    const user = req.user; // Use user attached by verifyToken
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
    const user = req.user; // Use user attached by verifyToken
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