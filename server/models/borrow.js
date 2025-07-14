module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Borrow', {
    borrowDate: DataTypes.DATE,
    returnDate: DataTypes.DATE,
  });
};
