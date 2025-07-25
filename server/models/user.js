module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    date_of_birth: { type: DataTypes.DATEONLY },
    phone: { type: DataTypes.STRING },
    profile_image: { type: DataTypes.STRING },
    roleId: {  // <-- only one foreign key column here
      type: DataTypes.INTEGER,
      references: {
        model: 'roles',
        key: 'id',
      },
      allowNull: true,
    }
  });
  return User;
};
