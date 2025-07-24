const express = require("express");
const {
  getAllUsers,
  deleteUser,
  deleteAccount,
  updateUser,
  getUserById,
  getUserProfile,
  allAccess,
  userBoard,
  adminBoard,
  librarianBoard,

} = require("../controllers/userController");
const {
  verifyToken,
  verifyTokengetuser,
  isAdmin,
  isLibrarian,
} = require("../middlewares/authJwt");


const router = express.Router();
// Public route
router.get("/public", allAccess);

// Protected route
router.get("/", verifyTokengetuser, getAllUsers);//get all users 
router.get("/:id", verifyTokengetuser, getUserById);//get user by id
router.put("/:id", verifyTokengetuser, updateUser);//update user by id
router.get("/profile", verifyToken, getUserProfile);//get user profile using usename and password

// Role-based routes
router.get("/users", verifyToken, userBoard);
router.get("/librarian", [verifyToken, isLibrarian], librarianBoard);
router.get("/admin", [verifyToken, isAdmin], adminBoard);

module.exports = router;