const jwt = require("jsonwebtoken");
const db = require("../models");
const authConfig = require("../config/auth.config.js");

const { user: User } = db;

const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), authConfig.secret);
    req.userId = decoded.id;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    const adminRole = roles.find((role) => role.name === "admin");
    if (adminRole) {
      next();
      return;
    }

    res.status(403).json({ message: "Require Admin Role!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isLibrarian = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    const modRole = roles.find((role) => role.name === "librarian");
    if (modRole) {
      next();
      return;
    }

    res.status(403).json({ message: "Require librarian Role!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isLibrarianOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    const hasRole = roles.some((role) => ["admin", "librarian"].includes(role.name));
    if (hasRole) {
      next();
      return;
    }

    res.status(403).json({ message: "Require Moderator or Admin Role!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all functions for CommonJS
module.exports = {
  verifyToken,
  isAdmin,
  isLibrarian,
  isLibrarianOrAdmin,
};
