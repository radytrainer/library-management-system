const db = require('../models');
const Borrow = db.Borrow;
const Book = db.Book;
const User = db.User;

// Helper to format borrow record output
const formatBorrow = (borrow) => ({
  id: borrow.id,
  user_name: borrow.user?.name,
  email_borrower: borrow.user?.email,
  book_name: borrow.book?.title,
  librarian_name: borrow.librarian?.name,
  quantity: borrow.book?.quantity,
  date_borrow: borrow.borrow_date,
  date_return: borrow.return_date,
  status: borrow.status
});

exports.index = async (req, res) => {
  try {
    const borrows = await Borrow.findAll({
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: Book, as: 'book', attributes: ['title', 'quantity'] },
        { model: User, as: 'librarian', attributes: ['name'] }
      ],
    });

    res.json(borrows.map(formatBorrow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch borrow records.' });
  }
};

exports.show = async (req, res) => {
  try {
    const borrow = await Borrow.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: Book, as: 'book', attributes: ['title', 'quantity'] },
        { model: User, as: 'librarian', attributes: ['name'] }
      ],
    });

    if (!borrow) return res.status(404).json({ message: 'Borrow record not found.' });

    res.json(formatBorrow(borrow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch borrow record.' });
  }
};

exports.store = async (req, res) => {
  try {
    const { user_id, book_id, librarian_id } = req.body;

    if (!user_id || !book_id || !librarian_id) {
      return res.status(400).json({ message: 'user_id, book_id, and librarian_id are required.' });
    }

    const book = await Book.findByPk(book_id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    if (!book.available) return res.status(400).json({ message: 'Book is already borrowed.' });

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 7);

    const newBorrow = await Borrow.create({
      user_id,
      book_id,
      librarian_id,
      borrow_date: borrowDate,
      due_date: dueDate,
      status: 'borrowed',
    });

    await book.update({ available: false });

    // Fetch created borrow with associations for response
    const borrowWithAssociations = await Borrow.findByPk(newBorrow.id, {
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: Book, as: 'book', attributes: ['title', 'quantity'] },
        { model: User, as: 'librarian', attributes: ['name'] }
      ],
    });

    res.status(201).json({ message: 'Book borrowed successfully.', borrow: formatBorrow(borrowWithAssociations) });
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

    if (status === 'returned') {
      const book = await Book.findByPk(borrow.book_id);
      if (book) await book.update({ available: true });
    }

    // Fetch updated borrow with associations for response
    const updatedBorrow = await Borrow.findByPk(borrow.id, {
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: Book, as: 'book', attributes: ['title', 'quantity'] },
        { model: User, as: 'librarian', attributes: ['name'] }
      ],
    });

    res.json(formatBorrow(updatedBorrow));
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
