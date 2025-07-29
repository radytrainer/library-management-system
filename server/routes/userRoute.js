const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const authJwt = require("../middlewares/authJwt");
const multer = require("multer");

const path = require("path");
const fs = require("fs");

// ✅ Upload config
const uploadDir = path.join(__dirname, "../Uploads/users");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Middleware to handle optional file uploads
const uploadOptional = (req, res, next) => {
  if (req.headers['content-type']?.startsWith('multipart/form-data')) {
    upload.single("profile_image")(req, res, (err) => {
      if (err instanceof multer.MulterError) return res.status(400).json({ message: err.message });
      if (err) return res.status(500).json({ message: "Server error during upload." });
      next();
    });
  } else {
    next(); // ✅ Skip multer for JSON requests
  }
};

// ✅ Public boards
router.get("/all", userController.allAccess);
router.get("/user", [authJwt.verifyToken], userController.userBoard);
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], userController.adminBoard);
router.get("/librarian", [authJwt.verifyToken, authJwt.isLibrarian], userController.librarianBoard);

// ✅ Barcode route (must be above :id route)
router.get("/:id/barcode", [authJwt.verifyToken], userController.getUserBarcode);
router.get("/roles", [authJwt.verifyToken], userController.getRoles);

// ✅ User management (RESTful)
router.post("/create", [authJwt.verifyToken, authJwt.isLibrarianOrAdmin], uploadOptional, userController.createUser);
router.get("/users", [authJwt.verifyToken, authJwt.isLibrarianOrAdmin], userController.getAllUsers); // ✅ FIXED (no /users)
router.get("/:id", [authJwt.verifyToken, authJwt.isLibrarianOrAdmin], userController.getUserById);
router.put("/:id", [authJwt.verifyToken], userController.updateUser);
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.deleteUserById);

// ✅ Profile routes
router.get("/profile/me", [authJwt.verifyToken], userController.getUserProfile);
router.delete("/profile/me", [authJwt.verifyToken], userController.deleteAccount);

module.exports = router;
