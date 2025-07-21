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
    borrow_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    return_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "borrowed",
    },
  });

  // Add associations if needed
  Borrow.associate = (models) => {
    Borrow.belongsTo(models.User, { foreignKey: "user_id" });
    Borrow.belongsTo(models.Book, { foreignKey: "book_id" });
    Borrow.belongsTo(models.User, {
      foreignKey: "librarian_id",
      as: "librarian",
    });
  };

  return Borrow;
};
