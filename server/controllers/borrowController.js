const db = require('../models');
const Borrow = db.Borrow;
const Book = db.Book;

exports.index = async (req, res) => {
  try {
    const borrows = await Borrow.findAll({
      include: [
        { model: db.User, as: 'user' },
        { model: db.Book, as: 'book' },
        { model: db.User, as: 'librarian' }
      ],
    });
    res.json(borrows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch borrow records.' });
  }
};

exports.show = async (req, res) => {
  try {
    const borrow = await Borrow.findByPk(req.params.id, {
      include: [
        { model: db.User, as: 'user' },
        { model: db.Book, as: 'book' },
        { model: db.User, as: 'librarian' }
      ],
    });
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found.' });
    res.json(borrow);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch borrow record.' });
  }
};

exports.store = async (req, res) => {
  try {
    const { user_id, book_id, librarian_id } = req.body;

    // Validate required fields
    if (!user_id || !book_id || !librarian_id) {
      return res.status(400).json({ message: 'user_id, book_id, and librarian_id are required.' });
    }

    // Check if book exists and is available
    const book = await Book.findByPk(book_id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    if (!book.available) return res.status(400).json({ message: 'Book is already borrowed.' });

    // Create borrow record with borrow and due date
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 7); // Due in 7 days

    const newBorrow = await Borrow.create({
      user_id,
      book_id,
      librarian_id,
      borrow_date: borrowDate,
      due_date: dueDate,
      status: 'borrowed',
    });

    // Update book availability
    await book.update({ available: false });

    res.status(201).json({ message: 'Book borrowed successfully.', borrow: newBorrow });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to borrow book.' });
  }
};

exports.update = async (req, res) => {
  try {
    const borrow = await Borrow.findByPk(req.params.id);
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found.' });

    const { return_date, status } = req.body;

    await borrow.update({
      return_date: return_date || borrow.return_date,
      status: status || borrow.status,
    });

    // If book is returned, set book available
    if (status === 'returned') {
      const book = await Book.findByPk(borrow.book_id);
      if (book) await book.update({ available: true });
    }

    res.json(borrow);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update borrow record.' });
  }
};

exports.destroy = async (req, res) => {
  try {
    const borrow = await Borrow.findByPk(req.params.id);
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found.' });

    await borrow.destroy();
    res.json({ message: 'Borrow record deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete borrow record.' });
  }
};
