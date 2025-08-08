module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Book', {
    title: DataTypes.STRING,
    isbn: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    cover_image: DataTypes.STRING,
    donated_by: DataTypes.STRING,
    public_year: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // --- ADD THESE EXPLICIT FOREIGN KEY DEFINITIONS ---
    AuthorId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Assuming a book must have an author
      references: {
        model: 'Authors', // This should match the table name of your Author model
        key: 'id',
      },
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Assuming a book must have a category
      references: {
        model: 'Categories', // This should match the table name of your Category model
        key: 'id',
      },
    },
    language_id: { // Use language_id as per your association
      type: DataTypes.INTEGER,
      allowNull: false, // Assuming a book must have a language
      references: {
        model: 'Languages', // This should match the table name of your Language model
        key: 'id',
      },
    },
    // --- END OF ADDITIONS ---
  });
};
