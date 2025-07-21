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

// POST create a new book
exports.store = async (req, res) => {
  try {
    const { title, isbn, quantilty, donated_by, public_year, description, available } = req.body;
    const cover_image = req.file ? req.file.filename : null;

    const newBook = await Book.create({
      title,
      isbn,
      quantilty,
      cover_image,
      donated_by,
      public_year,
      description,
      available
    });

    const imageUrl = cover_image ? `${req.protocol}://${req.get('host')}/uploads/${cover_image}` : null;

    res.status(201).json({
      message: 'Book is created successfully.',
      book: {
        ...newBook.toJSON(),
        cover_image_url: imageUrl
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create book.' });
  }
};
