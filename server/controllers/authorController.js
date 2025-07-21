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