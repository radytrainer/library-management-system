const express = require("express");
const {
  signup,
  signin,
  logout,
  deleteAccount,
} = require("../controllers/authController.js");
const {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
} = require("../middlewares/verifySignUp");
const { verifyToken } = require("../middlewares/authJwt");

const router = express.Router();

// Public routes
router.post("/signup", [checkDuplicateUsernameOrEmail, checkRolesExisted], signup);
router.post("/signin", signin);

// Protected routes
router.post("/logout", verifyToken, logout);
router.delete("/delete-account", verifyToken, deleteAccount);

module.exports = router;
