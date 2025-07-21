const db = require('../models');
const Book = db.Book;

exports.index = async (req, res) => {
  const categories = await db.categories.findAll();
  res.json(categories);
};


