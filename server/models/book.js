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
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'categories', // name of the target table (lowercase plural!)
        key: 'id',
      }
    }
  });
};