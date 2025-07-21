module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    isbn: DataTypes.STRING,
    quantilty: DataTypes.INTEGER,
    cover_image: DataTypes.STRING,
    donated_by: DataTypes.STRING,
    public_year: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Book.associate = (models) => {
    Book.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
  };

  return Book;
};
