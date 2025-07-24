const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authJwt = require("../middlewares/authJwt");

// Public and role-specific boards
router.get("/all", userController.allAccess);
router.get("/user", [authJwt.verifyToken], userController.userBoard);
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], userController.adminBoard);
router.get("/librarian", [authJwt.verifyToken, authJwt.isLibrarian], userController.librarianBoard);

// User management routes
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], userController.createUser); // Admin creates user
router.get("/users", [authJwt.verifyToken, authJwt.isLibrarianOrAdmin], userController.getAllUsers); // Admin/librarian get all users
router.get("/:id", [authJwt.verifyToken, authJwt.isLibrarianOrAdmin], userController.getUserById); // Admin/librarian get user by ID

//  Flexible update: user can update self, admin can update others
router.put("/users/:id", [authJwt.verifyToken], userController.updateUser);

router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.deleteUserById); // Admin deletes user by ID

// Profile routes (self)
router.get("/profile", [authJwt.verifyToken], userController.getUserProfile); // Get own profile the user
router.delete("/profile", [authJwt.verifyToken], userController.deleteAccount); // Delete own account

module.exports = router;
