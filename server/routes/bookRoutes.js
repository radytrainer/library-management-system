const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController'); // Adjust path as needed

// GET all books
router.get('/', bookController.getBooks);

// GET a single book by ID
router.get('/:id', bookController.getBookById);

// POST create a new book
router.post('/', bookController.createBook);

// PUT update a book
router.put('/:id', bookController.updateBook);

// DELETE a book
router.delete('/:id', bookController.deleteBook);

module.exports = router;