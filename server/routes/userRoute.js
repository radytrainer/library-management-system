const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
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

// ✅ Middleware to handle optional file
const uploadOptional = (req, res, next) => {
  // ✅ Only run multer if it's multipart/form-data
  if (req.headers['content-type'] && req.headers['content-type'].startsWith('multipart/form-data')) {
    upload.single("profile_image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: "Server error during upload." });
      }
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

// ✅ User management (RESTful)
router.post("/", [authJwt.verifyToken, authJwt.isLibrarianOrAdmin], uploadOptional, userController.createUser); // POST /api/users
router.get("/", [authJwt.verifyToken, authJwt.isLibrarianOrAdmin], userController.getAllUsers); // GET /api/users
router.get("/:id", [authJwt.verifyToken, authJwt.isLibrarianOrAdmin], userController.getUserById); // GET /api/users/:id
router.put("/:id", [authJwt.verifyToken], userController.updateUser); // PUT /api/users/:id
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.deleteUserById); // DELETE /api/users/:id

// ✅ Profile routes
router.get("/profile/me", [authJwt.verifyToken], userController.getUserProfile); // GET /api/users/profile/me
router.delete("/profile/me", [authJwt.verifyToken], userController.deleteAccount); // DELETE /api/users/profile/me

module.exports = router;
