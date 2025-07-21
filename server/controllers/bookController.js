const db = require('../models');
const Book = db.Book;

// GET all books
exports.index = async (req, res) => {
  try {
    const books = await Book.findAll({
    });

    res.json({ books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};