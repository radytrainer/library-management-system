module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: { type: Sequelize.STRING, unique: true },
    email: { type: Sequelize.STRING, unique: true },
    password: { type: Sequelize.STRING },
    dob: { type: Sequelize.DATEONLY, allowNull: true },
    profile_image: { type: Sequelize.STRING, allowNull: true },
    phone: { type: Sequelize.STRING, allowNull: true, unique: true },
  }, {
    timestamps: true,
    tableName: "users",
  });

  return User;
};



