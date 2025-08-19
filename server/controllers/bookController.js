const { Book, Category, Author, Language, sequelize } = require('../models');
const fs = require('fs').promises;
const path = require('path');
const XLSX = require('xlsx');
const { v4: uuidv4 } = require('uuid');
const AuditLog = require('../models/AuditLog'); // Assume an AuditLog model exists
const { Op } = require('sequelize');

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
    return res.json({ book: bookData });
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
    // Re-fetch the book with included relations
    const createdBook = await Book.findByPk(newBook.id, {
      include: [
        { model: Category, as: 'category', attributes: ['name', 'description'] },
        { model: Author, as: 'author', attributes: ['name', 'biography', 'birth_date', 'nationality'] },
        { model: Language, as: 'language', attributes: ['name'] },
      ],
    });
    const bookData = {
      ...createdBook.toJSON(),
      cover_image_url: imageUrl,
    };
    res.status(201).json({
      message: 'Book is created successfully.',
      book: bookData,
    });
  } catch (error) {
    console.error('Failed to create book:', error);
    res.status(500).json({ message: 'Failed to create book.', error: error.message });
  }
};

// PUT update a book by ID (partial update supported)
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

    // Handle language if provided
    if (!language_id && language) {
      const lang = await Language.findOne({ where: { name: language } });
      if (!lang) return res.status(400).json({ message: `Language '${language}' not found.` });
      language_id = lang.id;
    }

    // Cover image handling
    const cover_image = req.file ? req.file.filename : book.cover_image;
    if (req.file) {
      const imagePath = path.join(__dirname, '../Uploads/books', cover_image);
      await fs.access(imagePath);
      console.log(`Image verified for update: ${imagePath}`);
    }

    // Only update fields that are provided
    if (title !== undefined) book.title = title;
    if (isbn !== undefined) book.isbn = isbn;
    if (quantity !== undefined) book.quantity = quantity;
    if (donated_by !== undefined) book.donated_by = donated_by;
    if (public_year !== undefined) book.public_year = public_year;
    if (description !== undefined) book.description = description;
    if (available !== undefined) book.available = available;
    if (CategoryId !== undefined) book.CategoryId = CategoryId;
    if (AuthorId !== undefined) book.AuthorId = AuthorId;
    if (language_id !== undefined) book.language_id = language_id;
    book.cover_image = cover_image;

    await book.save();

    const updatedBook = await Book.findByPk(bookId, {
      include: [
        { model: Category, as: 'category', attributes: ['name', 'description'] },
        { model: Author, as: 'author', attributes: ['name', 'biography', 'birth_date', 'nationality'] },
        { model: Language, as: 'language', attributes: ['name'] },
      ],
    });

    const imageUrl = cover_image
      ? `${req.protocol}://${req.get('host')}/uploads/books/${cover_image}?t=${Date.now()}`
      : null;

    res.json({
      message: 'Book updated successfully.',
      book: {
        ...updatedBook.toJSON(),
        cover_image_url: imageUrl,
      },
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

exports.getBooksLastMonth = async (req, res) => {
  try {
    const now = new Date();

    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // === ADD DEBUG LOGS HERE ===
    console.log('First day last month:', firstDayLastMonth);
    console.log('Last day last month:', lastDayLastMonth);

    // ==== OPTIONAL: temporary test with this month instead of last month ===
    // const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Your query:
    const total = await Book.count({
      where: {
        createdAt: {
          [Op.gte]: firstDayLastMonth,
          [Op.lte]: lastDayLastMonth,
        }
      }
    });


    // Log the total count found
    console.log('Total books found:', total);

    return res.json({ total });
  } catch (error) {
    console.error('Error fetching books last month:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};