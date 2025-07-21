const db = require('../models');
const Book = db.Book;

exports.index = async (req, res) => {
  const categories = await db.categories.findAll();
  res.json(categories);
};

exports.show = async (req, res) => {
  const categories = await db.categories.findByPk(req.params.id);
  if (!categories) return res.status(404).json({ message: 'category not found' });
  res.json(categories);
};


