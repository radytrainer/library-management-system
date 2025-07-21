const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const apiResource = require('./ApiRescource');
const bookController = require('../controllers/bookController');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config: save uploaded images to 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const resources = [
  apiResource('/books', bookController, {
    store: [upload.single('cover_image')],
    update: [upload.single('cover_image')],
  }),
];

resources.forEach(resource => {
  router.use(resource.path, resource.router);
});

module.exports = router;

