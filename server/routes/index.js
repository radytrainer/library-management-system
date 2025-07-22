const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const apiResource = require('./ApiRescource'); // Your custom helper

// Import controllers
const bookController = require('../controllers/bookController');
const categoryController = require('../controllers/categoriesController');
const authorController = require('../controllers/authorController');

// Upload base folder
const uploadDir = path.join(__dirname, '../uploads');

// Multer storage with dynamic folder based on route
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = uploadDir; // default

    if (req.baseUrl.includes('/authors')) {
      folder = path.join(uploadDir, 'authors');
    } else if (req.baseUrl.includes('/books')) {
      folder = path.join(uploadDir, 'books');
    } else if (req.baseUrl.includes('/categories')) {
      folder = path.join(uploadDir, 'categories');
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

// Setup API resources with multer upload middleware
const resources = [
  apiResource('/books', bookController, {
    store: [upload.single('cover_image')],
    update: [upload.single('cover_image')],
  }),
  apiResource('/borrow', bookController),
  apiResource('/categories', categoryController),
  apiResource('/authors', authorController, {
    store: [upload.single('profile_image')],
    update: [upload.single('profile_image')],
  }),
];

// Use each resource route
resources.forEach(resource => {
  router.use(resource.path, resource.router);
});

module.exports = router;