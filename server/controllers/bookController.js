const { Book, Category, Author, Language } = require('../models');

// GET all books
exports.index = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        { model: Category, attributes: ['name', 'description'] },
        { model: Author, attributes: ['name', 'biography', 'birth_date', 'nationality'] },
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
        { model: Category, attributes: ['name', 'description'] },
        { model: Author, attributes: ['name', 'biography', 'birth_date', 'nationality'] },
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
      language,   // language name, e.g., "English"
      language_id // optional if language_id is provided
    } = req.body;

    // If language_id is not given, but language name is given,
    // find the language id from the Language table
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

    // If language_id not provided but language name is, find language_id
    if (!language_id && language) {
      const lang = await Language.findOne({ where: { name: language } });
      if (!lang) {
        return res.status(400).json({ message: `Language '${language}' not found.` });
      }
      language_id = lang.id;
    }

    const cover_image = req.file ? req.file.filename : null;

    book.title = title;
    book.isbn = isbn;
    book.quantity = quantity;
    book.cover_image = cover_image || book.cover_image;
    book.donated_by = donated_by;
    book.public_year = public_year;
    book.description = description;
    book.available = available;
    book.CategoryId = CategoryId;
    book.AuthorId = AuthorId;
    book.language_id = language_id || book.language_id;

    await book.save();

    res.json({ message: 'Book updated successfully.', book });
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
