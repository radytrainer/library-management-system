const db = require('../models');
const Book = db.Book;
const Category = db.categories;

// GET all books
exports.index = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        {
          model: Category,
          attributes: ['name', 'description'],
        },
      ],
    });

    const booksWithImageUrl = books.map(book => {
      const bookData = book.toJSON();
      bookData.cover_image_url = bookData.cover_image
        ? `${req.protocol}://${req.get('host')}/uploads/${bookData.cover_image}`
        : null;
      return bookData;
    });

    res.json({ books: booksWithImageUrl });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

// GET book by id
exports.show = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ['name', 'description'],
        },
      ]
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const bookData = book.toJSON();
    bookData.cover_image_url = bookData.cover_image
      ? `${req.protocol}://${req.get('host')}/uploads/${bookData.cover_image}`
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
    const { title, isbn, quantity, donated_by, public_year, description, available, CategoryId } = req.body;
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
      CategoryId
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

// PUT update a book by ID
exports.update = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, isbn, quantity, donated_by, public_year, description, available, categoryId } = req.body;
    const cover_image = req.file ? req.file.filename : null;

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    book.title = title;
    book.isbn = isbn;
    book.quantity = quantity;
    book.cover_image = cover_image || book.cover_image; // Keep existing if no new image
    book.donated_by = donated_by;
    book.public_year = public_year;
    book.description = description;
    book.available = available;
    book.categoryId = categoryId;

    await book.save();

    res.json({ message: 'Book updated successfully.', book: book });
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
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    // Optionally, delete the image file from the uploads folder
    // You can use fs.unlink if you want to delete the file physically.

    await book.destroy();

    res.json({ message: 'Book deleted successfully.' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete book.' });
  }
};