const express = require("express");
const {
  getAllUsers,
  getUserProfile,
  deleteUser,
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
} = require("../controllers/userController");

const {
  verifyToken,
  isAdmin,
  isModerator,
} = require("../middlewares/authJwt");

const router = express.Router();
// Public route
router.get("/public", allAccess);

// Protected route
router.get("/profile", verifyToken, getUserProfile);
router.get("/", verifyToken, getAllUsers);
router.delete("/delete/:id", verifyToken, deleteUser);

// Role-based routes
router.get("/users", verifyToken, userBoard);
router.get("/librarian", [verifyToken, isModerator], moderatorBoard);
router.get("/admin", [verifyToken, isAdmin], adminBoard);

module.exports = router;
