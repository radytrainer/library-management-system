const { Book, Category, Author, Language } = require('../models');
const fs = require('fs').promises;
const path = require('path');
const XLSX = require('xlsx');

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

    // Re-fetch the book with included relations to ensure full data
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

    const bookData = {
      ...updatedBook.toJSON(),
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

// POST import multiple books from Excel
exports.importBooks = async (req, res) => {
  try {
    if (!req.files || !req.files.excelFile) {
      return res.status(400).json({
        success: false,
        message: 'No Excel file uploaded',
        errors: [{ error: 'Please upload an Excel file' }]
      });
    }

    const excelFile = req.files.excelFile[0];

    const validMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!validMimeTypes.includes(excelFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type',
        errors: [{ error: 'File must be a valid Excel document (.xlsx or .xls)' }]
      });
    }

    let workbook;
    try {
      workbook = XLSX.read(excelFile.buffer, {
        type: 'buffer',
        cellDates: true,
        cellNF: false,
        cellText: false
      });
    } catch (error) {
      console.error('Excel parsing error:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid Excel file format',
        errors: [{ error: 'The uploaded file is not a valid Excel document or may be corrupted' }]
      });
    }

    let booksData;
    try {
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      booksData = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
        blankrows: false
      });
    } catch (error) {
      console.error('Data extraction error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to read worksheet data',
        errors: [{ error: 'Could not extract data from the worksheet' }]
      });
    }

    if (!booksData || booksData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data found',
        errors: [{ error: 'The worksheet contains no data' }]
      });
    }

    const results = {
      total: booksData.length,
      success: 0,
      failed: 0,
      errors: [],
      importedBooks: []
    };

    for (const [index, row] of booksData.entries()) {
      const rowNumber = index + 2;
      try {
        console.log('Processing row', rowNumber, ':', row);
        const requiredFields = ['title', 'isbn', 'quantity', 'Author', 'Category', 'Language'];
        const missingFields = requiredFields.filter(field => !row[field] || row[field] === '');

        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        let author = await Author.findOne({ where: { name: row.Author } });
        if (!author) {
          author = await Author.create({ name: row.Author });
          console.log(`Created new author: ${row.Author}`);
        }

        let category = await Category.findOne({ where: { name: row.Category } });
        if (!category) {
          category = await Category.create({ name: row.Category });
          console.log(`Created new category: ${row.Category}`);
        }

        let language = await Language.findOne({ where: { name: row.Language } });
        if (!language) {
          language = await Language.create({ name: row.Language });
          console.log(`Created new language: ${row.Language}`);
        }

        const quantity = parseInt(row.quantity);
        if (isNaN(quantity)) {
          throw new Error(`Invalid quantity: ${row.quantity}`);
        }

        const book = await Book.create({
          title: row.title,
          isbn: row.isbn,
          quantity: quantity,
          cover_image: row.cover_image || null, // Use the Excel value directly
          donated_by: row.donated_by || null,
          public_year: row.public_year ? parseInt(row.public_year) : null,
          description: row.description || null,
          available: row.available === 'false' ? 0 : 1,
          AuthorId: author.id,
          CategoryId: category.id,
          language_id: language.id,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        results.importedBooks.push({
          id: book.id,
          title: book.title,
          isbn: book.isbn
        });
        results.success++;

      } catch (error) {
        results.failed++;
        console.error('Error in row', rowNumber, ':', error.message);
        results.errors.push({
          row: rowNumber,
          error: error.message,
          title: row.title || 'Untitled'
        });
      }
    }

    const response = {
      success: results.success > 0,
      message: `Imported ${results.success} of ${results.total} books successfully`,
      importedCount: results.success,
      failedCount: results.failed,
      importedBooks: results.importedBooks
    };

    if (results.failed > 0) {
      response.errors = results.errors;
    }

    res.status(results.success > 0 ? 201 : 400).json(response);

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during import',
      errors: [{ error: error.message }]
    });
  }
};