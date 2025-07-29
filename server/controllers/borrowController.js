const db = require('../models');
const Borrow = db.Borrow;
const Book = db.Book;
const User = db.User;

// Format borrow record output
const formatBorrow = (borrow) => ({
  id: borrow.id,
  user_name: borrow.user?.username || borrow.borrower_name,
  email: borrow.user?.email || borrow.borrower_email,
  book_name: borrow.book?.title,
  isbn: borrow.book?.isbn,
  quantity: borrow.borrowed_quantity,
  librarian_name: borrow.librarian?.username,
  date_borrow: borrow.borrow_date,
  date_return: borrow.return_date,
  status: borrow.status,
});

exports.index = async (req, res) => {
  try {
    const borrows = await db.Borrow.findAll({
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['username', 'email']
        },
        {
          model: db.User,
          as: 'librarian',
          attributes: ['username']
        },
        {
          model: db.Book,
          as: 'book',
          attributes: ['title', 'cover_image'],
          include: [
            {
              model: db.Author,
              as: 'author',
              attributes: ['name']
            },
            {
              model: db.Category,
              as: 'category',
              attributes: ['name']
            }
          ]
        }
      ]
    });

    const formatted = borrows.map(borrow => ({
      id: borrow.id,
      book: {
        title: borrow.book?.title || null,
        author: borrow.book?.author?.name || null,
        category: borrow.book?.category?.name || null,
        cover_image: borrow.book?.cover_image
          ? `${req.protocol}://${req.get('host')}/uploads/books/${borrow.book.cover_image}`
          : null
      },
      user: {
        name: borrow.user?.username || borrow.borrower_name || null,
        email: borrow.user?.email || borrow.borrower_email || null,
      },
      borrowed_quantity: borrow.borrowed_quantity,
      status: borrow.status,
      borrow_date: borrow.borrow_date,
      return_date: borrow.return_date,
      librarian: {
        name: borrow.librarian?.username || null
      }
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('[BorrowController] Error fetching borrow records:', error);
    res.status(500).json({ message: 'Failed to fetch borrow records.', error: error.message });
  }
};

exports.show = async (req, res) => {
  try {
    const borrow = await db.Borrow.findByPk(req.params.id, {
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['username', 'email']
        },
        {
          model: db.User,
          as: 'librarian',
          attributes: ['username']
        },
        {
          model: db.Book,
          as: 'book',
          attributes: ['title', 'cover_image'],
          include: [
            {
              model: db.Author,
              as: 'author',
              attributes: ['name']
            },
            {
              model: db.Category,
              as: 'category',
              attributes: ['name']
            }
          ]
        }
      ]
    });

    if (!borrow) {
      return res.status(404).json({ message: 'Borrow record not found.' });
    }

    const formatted = {
      id: borrow.id,
      book: {
        title: borrow.book?.title || null,
        author: borrow.book?.author?.name || null,
        category: borrow.book?.category?.name || null,
        cover_image: borrow.book?.cover_image || null
      },
      user: {
        name: borrow.user?.username || borrow.borrower_name || null,
        email: borrow.user?.email || borrow.borrower_email || null,
      },
      librarian: {
        name: borrow.librarian?.username || null
      },
      borrowed_quantity: borrow.borrowed_quantity,
      status: borrow.status,
      borrow_date: borrow.borrow_date,
      return_date: borrow.return_date
    };

    res.status(200).json(formatted);
  } catch (error) {
    console.error('[BorrowController] Error fetching borrow record:', error);
    res.status(500).json({ message: 'Failed to fetch borrow record.', error: error.message });
  }
};

// POST /api/borrows
exports.store = async (req, res) => {
  try {
    const {
      user_name,
      user_barcode,
      email,
      is_new_user,
      book_name,
      isbn,
      quantity,
      librarian_name,
      date_borrow,
      date_return,
      status
    } = req.body;

    let user = null;
    let borrower_name = null;
    let borrower_email = null;

    if (is_new_user) {
      // Guest borrower: save name/email only (no user account)
      borrower_name = user_name;
      borrower_email = email;
    } else {
      // Find existing user by barcode if provided, else by username
      if (user_barcode) {
        user = await User.findOne({ where: { barcode: user_barcode } });
      } else if (user_name) {
        user = await User.findOne({ where: { username: user_name } });
      }

      if (!user) return res.status(404).json({ message: 'User not found.' });
    }

    // Find book by title and ISBN
    const book = await Book.findOne({ where: { title: book_name, isbn } });
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    if (book.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough copies available.' });
    }

    // Find librarian
    const librarian = await User.findOne({ where: { username: librarian_name } });
    if (!librarian) return res.status(404).json({ message: 'Librarian not found.' });

    // Validate dates
    if (isNaN(new Date(date_borrow))) {
      return res.status(400).json({ message: 'Invalid borrow date.' });
    }
    if (date_return && isNaN(new Date(date_return))) {
      return res.status(400).json({ message: 'Invalid return date.' });
    }

    // Create borrow record
    const newBorrow = await Borrow.create({
      user_id: user ? user.id : null,
      borrower_name,
      borrower_email,
      book_id: book.id,
      librarian_id: librarian.id,
      isbn,
      borrow_date: new Date(date_borrow),
      return_date: new Date(date_return),
      status: status || 'borrowed',
      borrowed_quantity: quantity
    });

    // Update book quantity
    const updatedQuantity = book.quantity - quantity;
    await book.update({
      quantity: updatedQuantity,
      available: updatedQuantity > 0
    });

    // Fetch result with associations
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
    if (!borrow) {
      return res.status(404).json({ message: 'Borrow record not found.' });
    }

    const {
      user_name,
      borrower_name,
      borrower_email,
      book_name,
      return_date,
      status,
    } = req.body;

    // Variables to update
    const updateData = {};

    // Update user_id if user_name provided
    if (user_name) {
      const user = await User.findOne({ where: { username: user_name } });
      if (!user) return res.status(404).json({ message: 'User not found.' });
      updateData.user_id = user.id;

      // Clear guest borrower info when updating to existing user
      updateData.borrower_name = null;
      updateData.borrower_email = null;
    } else if (borrower_name || borrower_email) {
      // Update guest borrower info, clear user_id if switching to guest
      updateData.borrower_name = borrower_name || borrow.borrower_name;
      updateData.borrower_email = borrower_email || borrow.borrower_email;
      updateData.user_id = null;
    }

    // Update book_id if book_name provided
    if (book_name) {
      const book = await Book.findOne({ where: { title: book_name } });
      if (!book) return res.status(404).json({ message: 'Book not found.' });
      updateData.book_id = book.id;
    }

    if (return_date) updateData.return_date = return_date;
    if (status) updateData.status = status;

    // Update the borrow record
    await borrow.update(updateData);

    // If book is returned, mark available
    if (status === 'returned') {
      const book = await Book.findByPk(borrow.book_id);
      if (book) {
        await book.update({ available: true });
      }
    }

    // Fetch updated borrow with associations
    const updated = await Borrow.findByPk(borrow.id, {
      include: [
        { model: User, as: 'user', attributes: ['username', 'email'] },
        { model: User, as: 'librarian', attributes: ['username'] },
        { model: Book, as: 'book', attributes: ['title', 'isbn'] },
      ],
    });

    // Format response with fallback for guest borrower
    const formatted = {
      id: updated.id,
      book: {
        title: updated.book?.title,
        isbn: updated.book?.isbn,
      },
      user: {
        name: updated.user?.username || updated.borrower_name,
        email: updated.user?.email || updated.borrower_email,
      },
      librarian: {
        name: updated.librarian?.username,
      },
      borrowed_quantity: updated.borrowed_quantity,
      borrow_date: updated.borrow_date,
      return_date: updated.return_date,
      status: updated.status,
    };

    res.status(200).json(formatted);
  } catch (err) {
    console.error('[BorrowController] Failed to update borrow:', err);
    res.status(500).json({ message: 'Failed to update borrow record.', error: err.message });
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