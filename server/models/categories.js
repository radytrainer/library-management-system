module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Category', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  });
};