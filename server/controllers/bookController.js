const { Book, Category, Author, Language, sequelize } = require('../models');
const fs = require('fs').promises;
const path = require('path');
const XLSX = require('xlsx');
const { v4: uuidv4 } = require('uuid');
const AuditLog = require('../models/AuditLog'); // Assume an AuditLog model exists

// Helper function to validate ISBN format (simplified for ISBN-10 or ISBN-13)
const isValidISBN = (isbn) => {
  if (!isbn) return false;
  const isbnRegex = /^(?:\d{10}|\d{13})$/;
  return isbnRegex.test(isbn.replace(/[-\s]/g, ''));
};

// POST preview book import
exports.previewImport = async (req, res) => {
  try {
    if (!req.files || !req.files.excelFile) {
      return res.status(400).json({
        success: false,
        message: 'No Excel file uploaded',
        errors: [{ error: 'Please upload an Excel file' }],
      });
    }

    const excelFile = req.files.excelFile[0];
    const validMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];

    if (!validMimeTypes.includes(excelFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type',
        errors: [{ error: 'File must be a valid Excel or CSV document (.xlsx, .xls, .csv)' }],
      });
    }

    let workbook;
    try {
      workbook = XLSX.read(excelFile.buffer, {
        type: 'buffer',
        cellDates: true,
        cellNF: false,
        cellText: false,
      });
    } catch (error) {
      console.error('Excel/CSV parsing error:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid file format',
        errors: [{ error: 'The uploaded file is not a valid Excel/CSV document or may be corrupted' }],
      });
    }

    let booksData;
    try {
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      booksData = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
        blankrows: false,
      });
    } catch (error) {
      console.error('Data extraction error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to read worksheet data',
        errors: [{ error: 'Could not extract data from the worksheet' }],
      });
    }

    if (!booksData || booksData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data found',
        errors: [{ error: 'The worksheet contains no data' }],
      });
    }

    const results = {
      total: booksData.length,
      valid: 0,
      invalid: 0,
      duplicates: [],
      errors: [],
      booksToImport: [],
    };

    for (const [index, row] of booksData.entries()) {
      const rowNumber = index + 2;
      try {
        const requiredFields = ['title', 'isbn', 'quantity', 'Author', 'Category'];
        const missingFields = requiredFields.filter(field => !row[field] || row[field].toString().trim() === '');

        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        if (!isValidISBN(row.isbn)) {
          throw new Error('Invalid ISBN format');
        }

        if (isNaN(parseInt(row.quantity)) || parseInt(row.quantity) < 0) {
          throw new Error(`Invalid quantity: ${row.quantity}`);
        }

        const existingBook = await Book.findOne({ where: { isbn: row.isbn } });
        if (existingBook) {
          results.duplicates.push({
            row: rowNumber,
            isbn: row.isbn,
            title: row.title,
          });
        }

        results.booksToImport.push({
          row: rowNumber,
          title: row.title,
          isbn: row.isbn,
          quantity: parseInt(row.quantity),
          author: row.Author,
          category: row.Category,
          language: row.Language || null,
          donated_by: row.donated_by || null,
          public_year: row.public_year ? parseInt(row.public_year) : null,
          description: row.description || null,
          available: row.available === 'false' ? 0 : 1,
          cover_image_filename: row.cover_image_filename || null,
        });
        results.valid++;
      } catch (error) {
        results.invalid++;
        results.errors.push({
          row: rowNumber,
          error: error.message,
          title: row.title || 'Untitled',
        });
      }
    }

    res.json({
      success: results.valid > 0,
      message: `Preview: ${results.valid} valid rows, ${results.invalid} invalid rows`,
      totalRows: results.total,
      validRows: results.valid,
      invalidRows: results.invalid,
      duplicates: results.duplicates,
      booksToImport: results.booksToImport,
      errors: results.errors,
    });
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during preview',
      errors: [{ error: error.message }],
    });
  }
};

// POST import multiple books from Excel/CSV
exports.importBooks = async (req, res) => {
  try {
    if (!req.files || !req.files.excelFile) {
      return res.status(400).json({
        success: false,
        message: 'No Excel/CSV file uploaded',
        errors: [{ error: 'Please upload an Excel or CSV file' }],
      });
    }

    const excelFile = req.files.excelFile[0];
    const duplicateMode = req.body.duplicateMode || 'add_only'; // 'add_only' or 'add_or_update'
    const validMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];

    if (!validMimeTypes.includes(excelFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type',
        errors: [{ error: 'File must be a valid Excel or CSV document (.xlsx, .xls, .csv)' }],
      });
    }

    let workbook;
    try {
      workbook = XLSX.read(excelFile.buffer, {
        type: 'buffer',
        cellDates: true,
        cellNF: false,
        cellText: false,
      });
    } catch (error) {
      console.error('Excel/CSV parsing error:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid file format',
        errors: [{ error: 'The uploaded file is not a valid Excel/CSV document or may be corrupted' }],
      });
    }

    let booksData;
    try {
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      booksData = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
        blankrows: false,
      });
    } catch (error) {
      console.error('Data extraction error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to read worksheet data',
        errors: [{ error: 'Could not extract data from the worksheet' }],
      });
    }

    if (!booksData || booksData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data found',
        errors: [{ error: 'The worksheet contains no data' }],
      });
    }

    const results = {
      total: booksData.length,
      success: 0,
      failed: 0,
      skipped: 0,
      updated: 0,
      errors: [],
      importedBooks: [],
    };

    const transaction = await sequelize.transaction();

    try {
      for (const [index, row] of booksData.entries()) {
        const rowNumber = index + 2;
        try {
          const requiredFields = ['title', 'isbn', 'quantity', 'Author', 'Category'];
          const missingFields = requiredFields.filter(field => !row[field] || row[field].toString().trim() === '');

          if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
          }

          if (!isValidISBN(row.isbn)) {
            throw new Error('Invalid ISBN format');
          }

          const quantity = parseInt(row.quantity);
          if (isNaN(quantity) || quantity < 0) {
            throw new Error(`Invalid quantity: ${row.quantity}`);
          }

          let author = await Author.findOne({ where: { name: row.Author }, transaction });
          if (!author) {
            author = await Author.create({ name: row.Author }, { transaction });
            console.log(`Created new author: ${row.Author}`);
          }

          let category = await Category.findOne({ where: { name: row.Category }, transaction });
          if (!category) {
            category = await Category.create({ name: row.Category }, { transaction });
            console.log(`Created new category: ${row.Category}`);
          }

          let language = row.Language
            ? await Language.findOne({ where: { name: row.Language }, transaction })
            : null;
          if (row.Language && !language) {
            language = await Language.create({ name: row.Language }, { transaction });
            console.log(`Created new language: ${row.Language}`);
          }

          const existingBook = await Book.findOne({ where: { isbn: row.isbn }, transaction });
          if (existingBook && duplicateMode === 'add_only') {
            results.skipped++;
            results.errors.push({
              row: rowNumber,
              error: 'Book with this ISBN already exists (skipped due to add_only mode)',
              title: row.title,
            });
            continue;
          }

          if (existingBook && duplicateMode === 'add_or_update') {
            existingBook.title = row.title;
            existingBook.quantity = quantity;
            existingBook.donated_by = row.donated_by || null;
            existingBook.public_year = row.public_year ? parseInt(row.public_year) : null;
            existingBook.description = row.description || null;
            existingBook.available = row.available === 'false' ? 0 : 1;
            existingBook.CategoryId = category.id;
            existingBook.AuthorId = author.id;
            existingBook.language_id = language ? language.id : null;
            existingBook.cover_image = row.cover_image_filename || null;
            await existingBook.save({ transaction });

            results.updated++;
            results.importedBooks.push({
              id: existingBook.id,
              title: existingBook.title,
              isbn: existingBook.isbn,
            });
            continue;
          }

          const book = await Book.create({
            title: row.title,
            isbn: row.isbn,
            quantity: quantity,
            cover_image: row.cover_image_filename || null,
            donated_by: row.donated_by || null,
            public_year: row.public_year ? parseInt(row.public_year) : null,
            description: row.description || null,
            available: row.available === 'false' ? 0 : 1,
            AuthorId: author.id,
            CategoryId: category.id,
            language_id: language ? language.id : null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }, { transaction });

          results.importedBooks.push({
            id: book.id,
            title: book.title,
            isbn: book.isbn,
          });
          results.success++;
        } catch (error) {
          results.failed++;
          console.error('Error in row', rowNumber, ':', error.message);
          results.errors.push({
            row: rowNumber,
            error: error.message,
            title: row.title || 'Untitled',
          });
        }
      }

      // Log the import action
      await AuditLog.create({
        action: 'IMPORT_BOOKS',
        adminId: req.user?.id || 'unknown',
        details: `Imported ${results.success} books, updated ${results.updated}, skipped ${results.skipped}, failed ${results.failed} from file: ${excelFile.originalname}`,
        timestamp: new Date(),
      }, { transaction });

      await transaction.commit();

      const response = {
        success: results.success > 0 || results.updated > 0,
        message: `Imported ${results.success} books, updated ${results.updated}, skipped ${results.skipped} duplicates, ${results.failed} failed`,
        importedCount: results.success,
        updatedCount: results.updated,
        failedCount: results.failed,
        skippedCount: results.skipped,
        importedBooks: results.importedBooks,
      };

      if (results.failed > 0 || results.skipped > 0) {
        response.errors = results.errors;
      }

      res.status(results.success > 0 || results.updated > 0 ? 201 : 400).json(response);
    } catch (error) {
      await transaction.rollback();
      console.error('Import error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during import',
        errors: [{ error: error.message }],
      });
    }
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during import',
      errors: [{ error: error.message }],
    });
  }
};


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
  const transaction = await Book.sequelize.transaction(); // Start a transaction
  try {
    const { dryRun, updateExisting } = req.body;
    console.log(`Import Books: dryRun=${dryRun}, updateExisting=${updateExisting}`);

    if (!req.files || !req.files.excelFile || req.files.excelFile.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No Excel file uploaded',
        errors: [{ error: 'Please upload an Excel file' }]
      });
    }

    const excelFile = req.files.excelFile[0];
    const coverImages = req.files.cover_images || [];

    const validMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    if (!validMimeTypes.includes(excelFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type',
        errors: [{ error: 'File must be a valid Excel (.xlsx, .xls) or CSV document' }]
      });
    }

    let workbook;
    try {
      const fileBuffer = await fs.readFile(excelFile.path);
      workbook = XLSX.read(fileBuffer, {
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
        errors: [{ error: 'The uploaded file is not a valid Excel/CSV document or may be corrupted' }]
      });
    } finally {
      if (excelFile.path) {
        await fs.unlink(excelFile.path).catch(err => console.error('Failed to delete temp excel file:', err));
      }
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
      added: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      errors: [],
      importedBooks: []
    };

    // Map uploaded image original names to their new filenames generated by Multer
    const uploadedImageMap = {};
    coverImages.forEach(img => {
      uploadedImageMap[img.originalname] = img.filename;
    });

    for (const [index, row] of booksData.entries()) {
      const rowNumber = index + 2; // +2 for 0-indexed array and header row
      try {
        console.log('Processing row', rowNumber, ':', row);

        const requiredFields = ['title', 'isbn', 'quantity', 'Author', 'Category', 'Language'];
        const missingFields = requiredFields.filter(field => !row[field] || String(row[field]).trim() === '');
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate ISBN format (simple check for non-empty string)
        if (typeof row.isbn !== 'string' || row.isbn.trim() === '') {
          throw new Error('Invalid or empty ISBN.');
        }

        const quantity = parseInt(row.quantity);
        if (isNaN(quantity) || quantity < 0) { // Quantity must be non-negative
          throw new Error(`Invalid quantity: ${row.quantity}. Must be a non-negative integer.`);
        }

        let author = await Author.findOne({ where: { name: row.Author }, transaction });
        if (!author) {
          if (!dryRun) {
            author = await Author.create({ name: row.Author }, { transaction });
            console.log(`Created new author: ${row.Author}`);
          } else {
            // For dry run, simulate creation
            author = { id: `new-author-${row.Author}` };
          }
        }

        let category = await Category.findOne({ where: { name: row.Category }, transaction });
        if (!category) {
          if (!dryRun) {
            category = await Category.create({ name: row.Category }, { transaction });
            console.log(`Created new category: ${row.Category}`);
          } else {
            category = { id: `new-category-${row.Category}` };
          }
        }

        let language = await Language.findOne({ where: { name: row.Language }, transaction });
        if (!language) {
          if (!dryRun) {
            language = await Language.create({ name: row.Language }, { transaction });
            console.log(`Created new language: ${row.Language}`);
          } else {
            language = { id: `new-language-${row.Language}` };
          }
        }

        let bookCoverImage = null;
        if (row.cover_image_filename) {
          const originalImageName = row.cover_image_filename;
          if (uploadedImageMap[originalImageName]) {
            // Use the filename generated by multer for the uploaded image
            bookCoverImage = uploadedImageMap[originalImageName];
          } else {
            // If not uploaded with this batch, assume it's an existing file or just use the name from Excel
            bookCoverImage = originalImageName;
          }
        }

        const bookData = {
          title: row.title,
          isbn: row.isbn,
          quantity: quantity,
          cover_image: bookCoverImage,
          donated_by: row.donated_by || null,
          public_year: row.public_year ? parseInt(row.public_year) : null,
          description: row.description || null,
          available: row.available === 'FALSE' || row.available === 'false' || row.available === 0 ? 0 : 1, // Handle boolean from Excel
          AuthorId: author.id,
          CategoryId: category.id,
          language_id: language.id,
        };

        let existingBook = await Book.findOne({ where: { isbn: row.isbn }, transaction });

        if (existingBook) {
          if (updateExisting) {
            if (!dryRun) {
              await existingBook.update(bookData, { transaction });
              results.updated++;
            } else {
              results.updated++;
            }
            results.importedBooks.push({
              id: existingBook.id,
              title: bookData.title,
              isbn: bookData.isbn,
              status: 'updated'
            });
          } else {
            results.skipped++;
            results.errors.push({
              row: rowNumber,
              error: `Duplicate ISBN: A book with ISBN '${row.isbn}' already exists.`,
              title: row.title || 'Untitled',
              status: 'skipped'
            });
          }
        } else {
          if (!dryRun) {
            const newBook = await Book.create(bookData, { transaction });
            results.added++;
            results.importedBooks.push({
              id: newBook.id,
              title: newBook.title,
              isbn: newBook.isbn,
              status: 'added'
            });
          } else {
            results.added++;
            results.importedBooks.push({
              id: `new-book-${row.isbn}`, // Placeholder ID for dry run
              title: bookData.title,
              isbn: bookData.isbn,
              status: 'added'
            });
          }
        }
      } catch (error) {
        results.failed++;
        console.error('Error in row', rowNumber, ':', error.message);
        results.errors.push({
          row: rowNumber,
          error: error.message,
          title: row.title || 'Untitled',
          status: 'failed'
        });
      }
    }

    if (!dryRun) {
      await transaction.commit(); // Commit transaction if not dry run
    } else {
      await transaction.rollback(); // Rollback transaction for dry run
    }

    const response = {
      success: results.added > 0 || results.updated > 0,
      message: dryRun
        ? `Preview complete. ${results.added} books to add, ${results.updated} to update, ${results.skipped} skipped.`
        : `Import complete. ${results.added} books added, ${results.updated} updated, ${results.skipped} skipped.`,
      addedCount: results.added,
      updatedCount: results.updated,
      skippedCount: results.skipped,
      failedCount: results.failed,
      importedBooks: results.importedBooks,
    };

    if (results.failed > 0 || results.skipped > 0) {
      response.errors = results.errors;
    }

    res.status(dryRun || results.success ? 200 : 400).json(response);

  } catch (error) {
    await transaction.rollback(); // Rollback on any fatal error
    console.error('Import error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during import',
      errors: [{ error: error.message }]
    });
  }
};
