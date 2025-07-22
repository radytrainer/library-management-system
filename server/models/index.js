const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const userModel = require('./userModel');
const roleModel = require('./roleModel');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
// Call model functions to get Sequelize Models
db.user = userModel(sequelize, Sequelize);
db.role = roleModel(sequelize, Sequelize);

// Check that models are Sequelize Models
console.log("User model is Sequelize Model:", db.user.prototype instanceof Sequelize.Model);
console.log("Role model is Sequelize Model:", db.role.prototype instanceof Sequelize.Model);

// Setup associations
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
  as: "roles",
});

db.ROLES = ["user", "admin", "librarian"];

db.Book = require('./book')(sequelize, Sequelize.DataTypes);
db.Category  = require('./categories')(sequelize, Sequelize.DataTypes);
db.Author = require('./author')(sequelize, Sequelize.DataTypes);
db.borrow = require('./borrow')(sequelize, Sequelize.DataTypes);

db.Book.belongsTo(db.Category);
db.Category.hasMany(db.Book);

db.Book.belongsTo(db.Author);
db.Author.hasMany(db.Book);

module.exports = db;
