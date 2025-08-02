const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const authJwt = require("../middlewares/authJwt");
const uploadProfile = require("../middlewares/upload"); // your centralized multer
const multer = require('multer'); 
// Optional upload middleware to allow JSON or multipart/form-data
const uploadOptional = (req, res, next) => {
  if (req.headers['content-type']?.startsWith('multipart/form-data')) {
    uploadProfile.single("profile_image")(req, res, (err) => {
      if (err instanceof multer.MulterError) return res.status(400).json({ message: err.message });
      if (err) return res.status(500).json({ message: "Server error during upload." });
      next();
    });
  } else {
    next();
  }
};

// Public access routes
router.get("/all", userController.allAccess);
router.get("/user", [authJwt.verifyToken], userController.userBoard);
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], userController.adminBoard);
router.get("/librarian", [authJwt.verifyToken, authJwt.isLibrarian], userController.librarianBoard);

// Barcode & roles routes (put before :id route)
router.get("/:id/barcode", [authJwt.verifyToken], userController.getUserBarcode);
router.get("/roles", [authJwt.verifyToken], userController.getRoles);
router.get('/barcodes/excel', [authJwt.verifyToken, authJwt.isAdmin], userController.exportUsersWithImages);

// User CRUD routes
router.post(
  "/create",
  [authJwt.verifyToken, authJwt.isLibrarianOrAdmin],
  uploadOptional, // optional upload middleware
  userController.createUser
);
router.get(
  "/users",
  [authJwt.verifyToken, authJwt.isLibrarianOrAdmin],
  userController.getAllUsers
);
router.get(
  "/:id",
  [authJwt.verifyToken, authJwt.isLibrarianOrAdmin],
  userController.getUserById
);
router.put(
  "/:id",
  [authJwt.verifyToken],
  uploadOptional, // optional upload on update too
  userController.updateUser
);
router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.deleteUserById
);

// Profile routes
router.get("/profile/me", [authJwt.verifyToken], userController.getUserProfile);
router.delete("/profile/me", [authJwt.verifyToken], userController.deleteAccount);

module.exports = router;
