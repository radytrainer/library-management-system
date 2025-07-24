const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Your controller file
const authJwt = require("../middlewares/authJwt");

router.get("/all", userController.allAccess); // Public route
router.get("/user", [authJwt.verifyToken], userController.userBoard); // User route
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], userController.adminBoard); // Admin route
router.get("/librarian", [authJwt.verifyToken, authJwt.isLibrarian], userController.librarianBoard); // Librarian route

// User management routes
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], userController.createUser); // Create user (admin only)
router.get("/users", [authJwt.verifyToken, authJwt.isLibrarianOrAdmin], userController.getAllUsers); // Get all users (admin or librarian)
router.get("/:id", [authJwt.verifyToken, authJwt.isLibrarianOrAdmin], userController.getUserById); // Get user by ID (admin or librarian)
router.put("/:id", [authJwt.verifyToken, authJwt.isLibrarianOrAdmin], userController.updateUser); // Update user (admin or librarian) 
router.delete("/:id", [authJwt.verifyToken,authJwt.isAdmin], userController.deleteUserById); // Delete user (admin only)
router.get("/profile", [authJwt.verifyToken], userController.getUserProfile); // Get current user's profile
router.delete("/profile", [authJwt.verifyToken], userController.deleteAccount); // Delete current user's account

module.exports = router;