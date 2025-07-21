const { Author } = require('../models');

exports.store = async (req, res) => {
  try {
    const { name, biography, nationality, birth_date, isLiving } = req.body;

    if (!name || !birth_date) {
      return res.status(400).json({ error: 'Name and birth date are required.' });
    }

    const profile_image = req.file ? req.file.filename : null;

    const newAuthor = await Author.create({
      name,
      biography,
      nationality,
      birth_date,
      profile_image,
      isLiving,
    });

    const imageUrl = profile_image
      ? `${req.protocol}://${req.get('host')}/uploads/authors/${profile_image}`
      : null;

    res.status(201).json({
      message: 'Author created successfully.',
      author: {
        ...newAuthor.toJSON(),
        profile_image_url: imageUrl,
      },
    });
  } catch (error) {
    console.error('Error creating author:', error);
    res.status(500).json({ error: 'Failed to create author' });
  }
};