const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Book = require('./book')(sequelize, Sequelize.DataTypes);
db.Category  = require('./categories')(sequelize, Sequelize.DataTypes);
db.Author = require('./author')(sequelize, Sequelize.DataTypes);
db.borrow = require('./borrow')(sequelize, Sequelize.DataTypes);

db.Book.belongsTo(db.Category);
db.Category.hasMany(db.Book);

db.Book.belongsTo(db.Author);
db.Author.hasMany(db.Book);

module.exports = db;
