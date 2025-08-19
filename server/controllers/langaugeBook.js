const db = require('../models');
const Language = db.Language;

exports.index = async (req, res) => {
  const languages = await Language.findAll();
  res.json(languages);
};

exports.store = async (req, res) => {
  const { name, country } = req.body;
  if (!name) return res.status(400).json({ message: 'Language name is required.' });
  if (!country) return res.status(400).json({ message: 'Country is required.' });

  try {
    // Check if language with same name and country already exists
    const existingLanguage = await Language.findOne({
      where: { name, country }
    });

    if (existingLanguage) {
      return res.status(409).json({ message: 'Language with this name and country already exists.' });
    }

    // If not exist, create new language
    const language = await Language.create({ name, country });
    res.status(201).json(language);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create language.' });
  }
};


exports.update = async (req, res) => {
  const language = await Language.findByPk(req.params.id);
  if (!language) return res.status(404).json({ message: 'Language not found.' });

  try {
    await language.update({
      name: req.body.name || language.name,
      country: req.body.country || language.country,  // update country as well
    });
    res.json(language);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update language.' });
  }
};

exports.destroy = async (req, res) => {
  const language = await Language.findByPk(req.params.id);
  if (!language) return res.status(404).json({ message: 'Language not found.' });

  try {
    await language.destroy();
    res.json({ message: 'Language deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete language.' });
  }
};