const { Book, Category, Author, Language } = require('../models');
const fs = require('fs').promises;
const path = require('path');

// GET all books
exports.index = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        { model: Category, as: 'category', attributes: ['name', 'description'] },
        { model: Author, as: 'author', attributes: ['name', 'biography', 'birth_date', 'nationality'] },
        { model: Language, as: 'language', attributes: ['name'] },
      ],
    });

    const booksWithImageUrl = books.map(book => {
      const bookData = book.toJSON();
      bookData.cover_image_url = bookData.cover_image
        ? `${req.protocol}://${req.get('host')}/uploads/books/${bookData.cover_image}`
        : null;
      return bookData;
    });

    res.json({ books: booksWithImageUrl });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

// GET book by ID
exports.show = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category', attributes: ['name', 'description'] },
        { model: Author, as: 'author', attributes: ['name', 'biography', 'birth_date', 'nationality'] },
        { model: Language, as: 'language', attributes: ['name'] },
      ],
    });

    if (!book) return res.status(404).json({ error: 'Book not found' });

    const bookData = book.toJSON();
    bookData.cover_image_url = bookData.cover_image
      ? `${req.protocol}://${req.get('host')}/uploads/books/${bookData.cover_image}`
      : null;

    res.json({ book: bookData });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
};


// POST create a new book
exports.store = async (req, res) => {
  try {
    let {
      title,
      isbn,
      quantity,
      donated_by,
      public_year,
      description,
      available,
      CategoryId,
      AuthorId,
      language,
      language_id
    } = req.body;

    if (!language_id && language) {
      const lang = await Language.findOne({ where: { name: language } });
      if (!lang) {
        return res.status(400).json({ message: `Language '${language}' not found.` });
      }
      language_id = lang.id;
    }

    // language_id is required for the Book model
    if (!language_id) {
      return res.status(400).json({ message: 'Language ID or valid language name is required.' });
    }

    const cover_image = req.file ? req.file.filename : null;

    const newBook = await Book.create({
      title,
      isbn,
      quantity,
      cover_image,
      donated_by,
      public_year,
      description,
      available,
      CategoryId,
      AuthorId,
      language_id,
    });

    const imageUrl = cover_image
      ? `${req.protocol}://${req.get('host')}/uploads/books/${cover_image}`
      : null;

    res.status(201).json({
      message: 'Book is created successfully.',
      book: {
        ...newBook.toJSON(),
        cover_image_url: imageUrl,
      },
    });
  } catch (error) {
    console.error('Failed to create book:', error);
    res.status(500).json({ message: 'Failed to create book.', error: error.message });
  }
};


// PUT update a book by ID
// PUT update a book by ID
exports.update = async (req, res) => {
  try {
    const bookId = req.params.id;
    let {
      title,
      isbn,
      quantity,
      donated_by,
      public_year,
      description,
      available,
      CategoryId,
      AuthorId,
      language_id,
      language,
    } = req.body;

    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    if (!language_id && language) {
      const lang = await Language.findOne({ where: { name: language } });
      if (!lang) {
        return res.status(400).json({ message: `Language '${language}' not found.` });
      }
      language_id = lang.id;
    }

    const cover_image = req.file ? req.file.filename : book.cover_image;

    // Verify image file exists if a new file was uploaded
    if (req.file) {
      const imagePath = path.join(__dirname, '../Uploads/books', cover_image);
      await fs.access(imagePath);
      console.log(`Image verified for update: ${imagePath}`);
    } else if (cover_image) {
      // Verify existing image file
      const imagePath = path.join(__dirname, '../Uploads/books', cover_image);
      try {
        await fs.access(imagePath);
        console.log(`Existing image verified: ${imagePath}`);
      } catch (error) {
        console.warn(`Existing image not found: ${imagePath}, setting cover_image to null`);
        cover_image = null; // Reset if the file doesn't exist
      }
    }

    book.title = title;
    book.isbn = isbn;
    book.quantity = quantity;
    book.cover_image = cover_image;
    book.donated_by = donated_by;
    book.public_year = public_year;
    book.description = description;
    book.available = available;
    book.CategoryId = CategoryId;
    book.AuthorId = AuthorId;
    book.language_id = language_id || book.language_id;

    await book.save();

    const imageUrl = cover_image
      ? `${req.protocol}://${req.get('host')}/uploads/books/${cover_image}?t=${Date.now()}`
      : null;

    const bookData = {
      ...book.toJSON(),
      cover_image_url: imageUrl,
    };

    console.log('Update response sent:', bookData); // Debug log

    res.json({
      message: 'Book updated successfully.',
      book: bookData,
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Failed to update book.' });
  }
};

// DELETE a book by ID
exports.destroy = async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    await book.destroy();

    res.json({ message: 'Book deleted successfully.' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete book.' });
  }
};
