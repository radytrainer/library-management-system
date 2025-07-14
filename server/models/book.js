module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Book', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    isbn: DataTypes.STRING,
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};
