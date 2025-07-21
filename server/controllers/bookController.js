const db = require('../models');
const Book = db.Book;

// GET all books
exports.index = async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
};

// GET a single book by ID
exports.show = async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
};

// POST create a new book
exports.store = async (req, res) => {
  const { title, author, isbn, available } = req.body;
  const newBook = await Book.create({ title, author, isbn, available });
  res.status(201).json(newBook);
};

// PUT update a book
exports.update = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findByPk(id);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const { title, author, isbn, available } = req.body;
  await book.update({ title, author, isbn, available });
  res.json(book);
};

// DELETE a book
exports.destroy = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findByPk(id);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  await book.destroy();
  res.json({ message: 'Book deleted successfully' });
};
