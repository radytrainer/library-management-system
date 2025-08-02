const { Author } = require('../models');

// Get all authors
exports.index = async (req, res) => {
    try {
        const authors = await Author.findAll();

        const authorsWithImageUrl = authors.map(author => {
            const authorData = author.toJSON();
            authorData.profile_image_url = authorData.profile_image
                ? `${req.protocol}://${req.get('host')}/uploads/authors/${authorData.profile_image}`
                : null;
            return authorData;
        });

        res.status(200).json(authorsWithImageUrl);
    } catch (error) {
        console.error('Error fetching authors:', error);
        res.status(500).json({ error: 'Failed to fetch authors' });
    }
};

// Get a single author by ID
exports.show = async (req, res) => {
    try {
        const author = await Author.findByPk(req.params.id);

        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }

        const imageUrl = author.profile_image
            ? `${req.protocol}://${req.get('host')}/uploads/authors/${author.profile_image}`
            : null;

        res.status(200).json({
            author: {
                ...author.toJSON(),
                profile_image_url: imageUrl,
            },
        });
    } catch (error) {
        console.error('Error fetching author:', error);
        res.status(500).json({ error: 'Failed to fetch author' });
    }
};

// Add a new author
exports.store = async (req, res) => {
  try {
    const { name, biography, nationality, birth_date, isLiving } = req.body;
    if (!name || !birth_date) {
      return res.status(400).json({ error: 'Name and birth date are required.' });
    }

    const profile_image = req.file ? req.file.filename : null;

    // Use a transaction to ensure atomicity
    const newAuthor = await Author.sequelize.transaction(async (t) => {
      return await Author.create({
        name,
        biography,
        nationality,
        birth_date,
        profile_image,
        isLiving,
      }, { transaction: t });
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

// Update an existing author
exports.update = async (req, res) => {
    try {
        const author = await Author.findByPk(req.params.id);

        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }

        const { name, biography, nationality, birth_date, isLiving } = req.body;
        const profile_image = req.file ? req.file.filename : author.profile_image;

        await author.update({
            name,
            biography,
            nationality,
            birth_date,
            isLiving,
            profile_image,
        });

        res.status(200).json({ message: 'Author updated successfully.', author: author.toJSON(), profile_image_url: profile_image ? `${req.protocol}://${req.get('host')}/uploads/authors/${profile_image}` : null });
    } catch (error) {
        console.error('Error updating author:', error);
        res.status(500).json({ error: 'Failed to update author' });
    }
};

// Delete an author
exports.destroy = async (req, res) => {
    try {
        const author = await Author.findByPk(req.params.id);

        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }

        await author.destroy();
        res.status(200).json({ message: 'Author deleted successfully.' });
    } catch (error) {
        console.error('Error deleting author:', error);
        res.status(500).json({ error: 'Failed to delete author' });
    }
};