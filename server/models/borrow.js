module.exports = (sequelize, DataTypes) => {
  const Borrow = sequelize.define("Borrow", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    librarian_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    borrowed_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    borrow_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    return_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "borrowed",
    },
  });



  return Borrow;
};