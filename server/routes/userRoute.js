const express = require("express");
const {
  getAllUsers,
  deleteUser,
  deleteAccount,
  getUserProfile,
  allAccess,
  userBoard,
  adminBoard,
  librarianBoard,

} = require("../controllers/userController");

const {
  verifyToken,
  isAdmin,
  isLibrarian,
} = require("../middlewares/authJwt");

const router = express.Router();
// Public route
router.get("/public", allAccess);

// Protected route
router.get("/profile", verifyToken, getUserProfile);
router.get("/", verifyToken, getAllUsers);//get all users 
// Delete account route
router.delete('/:id', [verifyToken, isAdmin], deleteUser);
router.delete('/me', verifyToken, deleteAccount);


// Role-based routes
router.get("/users", verifyToken, userBoard);
router.get("/librarian", [verifyToken, isLibrarian], librarianBoard);
router.get("/admin", [verifyToken, isAdmin], adminBoard);

module.exports = router;
