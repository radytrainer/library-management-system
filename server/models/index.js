const Sequelize = require("sequelize")
const sequelize = require("../config/db")
const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.Book = require("./book")(sequelize, Sequelize.DataTypes)
db.Category = require("./categories")(sequelize, Sequelize.DataTypes)
db.Author = require("./author")(sequelize, Sequelize.DataTypes)
db.User = require("./user")(sequelize, Sequelize.DataTypes)
db.Role = require("./role")(sequelize, Sequelize.DataTypes)

// Book relationships
db.Book.belongsTo(db.Category)
db.Category.hasMany(db.Book)

db.Book.belongsTo(db.Author)
db.Author.hasMany(db.Book)

// User-Role relationship (One-to-Many: One Role can have many Users)
db.User.belongsTo(db.Role, {
  foreignKey: "roleId",
  as: "Role", // 👈 This tells Sequelize: "Role" is a custom alias
})
db.Role.hasMany(db.User, {
  foreignKey: "roleId",
  as: "Users",
})

module.exports = db
