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

exports.store = async (req, res) => {
  const { name, description } = req.body;

  // 1. Check if name or description is missing
  if (!name || !description) {
    return res.status(400).json({
      message: 'Both name and description are required.',
    });
  }

  // 2. Check if category with the same name already exists
  const existingCategory = await db.categories.findOne({ where: { name } });

  if (existingCategory) {
    return res.status(409).json({
      message: 'A category with this name already exists.',
    });
  }

  // 3. If all good, create the category
  const newCategory = await db.categories.create({ name, description });
  return res.status(201).json(newCategory);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const categories = await db.categories.findByPk(id);
  if (!categories) return res.status(404).json({ message: 'category not found' });

  const { name, description } = req.body;
  await categories.update({ name, description});
  res.json(categories);
};

exports.destroy = async (req, res) => {
  const { id } = req.params;
  const categories = await db.categories.findByPk(id);
  if (!categories) return res.status(404).json({ message: 'category not found' });

  await categories.destroy();
  res.json({ message: 'category deleted successfully' });
};
