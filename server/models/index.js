const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Book = require('./book')(sequelize, Sequelize.DataTypes);
db.categories = require('./categories')(sequelize, Sequelize.DataTypes);
db.Author = require('./author')(sequelize, Sequelize.DataTypes);

db.Book.belongsTo(db.categories)
db.categories.hasMany(db.Book)

module.exports = db;
