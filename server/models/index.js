const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Book = require('./book')(sequelize, Sequelize.DataTypes);
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Borrow = require('./borrow')(sequelize, Sequelize.DataTypes);

// Associations
db.User.hasMany(db.Borrow);
db.Book.hasMany(db.Borrow);
db.Borrow.belongsTo(db.User);
db.Borrow.belongsTo(db.Book);

module.exports = db;