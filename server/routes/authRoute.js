const express = require("express");
const {
  signup,
  signin,
  logout,
} = require("../controllers/authController.js");
const {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
} = require("../middlewares/verifySignUp");
const { verifyToken } = require("../middlewares/authJwt");

const router = express.Router();
const upload = require("../middlewares/upload");

// Use multer middleware for profile_image field
router.post("/signup", upload.single("profile_image"),signup);

// Public routes
router.post("/signup", [checkDuplicateUsernameOrEmail, checkRolesExisted], signup);
router.post("/signin", signin);

// Protected routes
router.post("/logout", verifyToken, logout);
module.exports = router;
