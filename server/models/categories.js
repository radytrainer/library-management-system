module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  });

  Category.associate = (models) => {
    Category.hasMany(models.Book, {
      foreignKey: 'category_id',
      as: 'books',
    });
  };

  return Category;
};
