const db = require('../models');
const Borrow = db.Borrow;
const Book = db.Book;
const User = db.User;

// Format borrow record output
const formatBorrow = (borrow) => ({
  id: borrow.id,
  user_name: borrow.user?.username,
  email_borrower: borrow.user?.email,
  book_name: borrow.book?.title,
  isbn: borrow.book?.isbn,
  quantity: borrow.borrowed_quantity,
  librarian_name: borrow.librarian?.username,
  date_borrow: borrow.borrow_date,
  date_return: borrow.return_date,
  status: borrow.status,
});

// GET /api/borrows
exports.index = async (req, res) => {
  try {
    const borrows = await Borrow.findAll({
      include: [
        { model: User, as: 'user', attributes: ['username', 'email'] },
        { model: Book, as: 'book', attributes: ['title', 'isbn', 'quantity'] },
        { model: User, as: 'librarian', attributes: ['username'] }
      ]
    });

    res.json(borrows.map(formatBorrow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch borrow records.' });
  }
};

// GET /api/borrows/:id
exports.show = async (req, res) => {
  try {
    const borrow = await Borrow.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['username', 'email'] },
        { model: Book, as: 'book', attributes: ['title', 'isbn', 'quantity'] },
        { model: User, as: 'librarian', attributes: ['username'] }
      ]
    });

    if (!borrow) return res.status(404).json({ message: 'Borrow record not found.' });

    res.json(formatBorrow(borrow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch borrow record.' });
  }
};

// POST /api/borrows
exports.store = async (req, res) => {
  try {
    const {
      user_name,
      email_borrower,
      book_name,
      isbn,
      quantity,
      librarian_name,
      date_borrow,
      date_return,
      status
    } = req.body;

    // 1. Find user
    const user = await User.findOne({
      where: { username: user_name, email: email_borrower }
    });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // 2. Find book by title + ISBN
    const book = await Book.findOne({ where: { title: book_name, isbn } });
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    // 3. Check available quantity
    if (book.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough copies available.' });
    }

    // 4. Find librarian
    const librarian = await User.findOne({ where: { username: librarian_name } });
    if (!librarian) return res.status(404).json({ message: 'Librarian not found.' });
        // Basic input validation
    if (!user_name || !email_borrower || !book_name || !isbn || !quantity || !librarian_name || !date_borrow) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number.' });
    }

    // Validate dates
    if (isNaN(new Date(date_borrow))) {
      return res.status(400).json({ message: 'Invalid borrow date.' });
    }
    if (date_return && isNaN(new Date(date_return))) {
      return res.status(400).json({ message: 'Invalid return date.' });
    }

    // 5. Create borrow record
const newBorrow = await Borrow.create({
  user_id: user.id,
  book_id: book.id,
  librarian_id: librarian.id,
  isbn: isbn, // <-- ✅ ADD THIS LINE
  borrow_date: new Date(date_borrow),
  return_date: new Date(date_return),
  status: status || 'borrowed',
  borrowed_quantity: quantity
});


    // 6. Update book quantity and availability
    const updatedQuantity = book.quantity - quantity;
    await book.update({
      quantity: updatedQuantity,
      available: updatedQuantity > 0
    });

    // 7. Return the borrow record
    const borrowWithAssociations = await Borrow.findByPk(newBorrow.id, {
      include: [
        { model: User, as: 'user', attributes: ['username', 'email'] },
        { model: Book, as: 'book', attributes: ['title', 'isbn', 'quantity'] },
        { model: User, as: 'librarian', attributes: ['username'] }
      ]
    });

    res.status(201).json({
      message: 'Book borrowed successfully.',
      borrow: formatBorrow(borrowWithAssociations)
    });

  } catch (err) {
    console.error('Error borrowing book:', err);
    res.status(500).json({
      message: 'Failed to create borrow record.',
      error: err.message
    });
  }
};

// PUT /api/borrows/:id
exports.update = async (req, res) => {
  try {
    const borrow = await Borrow.findByPk(req.params.id);
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found.' });

    const { return_date, status } = req.body;

    await borrow.update({
      return_date: return_date || borrow.return_date,
      status: status || borrow.status
    });

    if (status === 'returned') {
      const book = await Book.findByPk(borrow.book_id);
      if (book) await book.update({ available: true });
    }

    const updatedBorrow = await Borrow.findByPk(borrow.id, {
      include: [
        { model: User, as: 'user', attributes: ['username', 'email'] },
        { model: Book, as: 'book', attributes: ['title', 'isbn', 'quantity'] },
        { model: User, as: 'librarian', attributes: ['username'] }
      ]
    });

    res.json(formatBorrow(updatedBorrow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update borrow record.' });
  }
};

// DELETE /api/borrows/:id
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