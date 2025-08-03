const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const apiResource = require('./ApiRescource');

// Import controllers
const bookController = require('../controllers/bookController');
const categoryController = require('../controllers/categoriesController');
const authorController = require('../controllers/authorController');
const borrowController = require('../controllers/borrowController');
const languageBook = require('../controllers/langaugeBook');
const donationController = require('../controllers/donationController');

// Upload base folder
const uploadDir = path.join(__dirname, '../uploads');

// Multer storage config (dynamically set folder based on route)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = uploadDir;

    if (req.baseUrl.includes('/authors')) {
      folder = path.join(uploadDir, 'authors');
    } else if (req.baseUrl.includes('/books')) {
      folder = path.join(uploadDir, 'books');
    } else if (req.baseUrl.includes('/categories')) {
      folder = path.join(uploadDir, 'categories');
    } else if (req.baseUrl.includes('/donations')) {
      folder = path.join(uploadDir, 'donations');
    }

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Register all routes
const resources = [
  apiResource('/books', bookController, {
    store: [upload.single('cover_image')],
    update: [upload.single('cover_image')],
  }),
  apiResource('/borrow', borrowController),
  apiResource('/categories', categoryController),
  apiResource('/language', languageBook),
  apiResource('/authors', authorController, {
    store: [upload.single('profile_image')],
    update: [upload.single('profile_image')],
  }),

  // ✅ Donation route with upload middleware
  apiResource('/donations', donationController, {
    store: [upload.single('cover_image')],   // for create
    update: [upload.single('cover_image')],  // for update
  }),
];
router.get("/api/reminder-test", borrowController.sendReturnReminders);

// Register each resource to the main router
resources.forEach(resource => {
  router.use(resource.path, resource.router);
});

module.exports = router;
