const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Import model definitions
const UserModel = require('./userModel');
const RoleModel = require('./roleModel');
const BookModel = require('./book');
const CategoryModel = require('./categories');
const AuthorModel = require('./author');
const BorrowModel = require('./borrow');
const LanguageModel = require('./languageBook');

const db = {};

// Sequelize instance and constructor
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Initialize models with sequelize instance and Sequelize data types
db.User = UserModel(sequelize, Sequelize.DataTypes);
db.Role = RoleModel(sequelize, Sequelize.DataTypes);
db.Book = BookModel(sequelize, Sequelize.DataTypes);
db.Category = CategoryModel(sequelize, Sequelize.DataTypes);
db.Author = AuthorModel(sequelize, Sequelize.DataTypes);
db.Borrow = BorrowModel(sequelize, Sequelize.DataTypes);
db.Language = LanguageModel(sequelize, Sequelize.DataTypes);

// Many-to-many: Role <-> User through user_roles join table
db.Role.belongsToMany(db.User, {
  through: 'user_roles',
  foreignKey: 'roleId',
  otherKey: 'userId',
});
db.User.belongsToMany(db.Role, {
  through: 'user_roles',
  foreignKey: 'userId',
  otherKey: 'roleId',
  as: 'roles',
});

db.Book.belongsTo(db.Author, { foreignKey: 'AuthorId', as: 'author' });
db.Author.hasMany(db.Book, { foreignKey: 'AuthorId' });

db.Book.belongsTo(db.Category, { foreignKey: 'CategoryId', as: 'category' });
db.Category.hasMany(db.Book, { foreignKey: 'CategoryId' });


// Define any other associations you have, for example Borrow relations
db.Borrow.belongsTo(db.User, { as: 'user', foreignKey: 'user_id' });
db.Borrow.belongsTo(db.User, { as: 'librarian', foreignKey: 'librarian_id' });
db.Borrow.belongsTo(db.Book, { as: 'book', foreignKey: 'book_id' });

db.User.hasMany(db.Borrow, { foreignKey: 'user_id' });
db.User.hasMany(db.Borrow, { as: 'librarianBorrows', foreignKey: 'librarian_id' });
db.Book.hasMany(db.Borrow, { foreignKey: 'book_id' });
db.Book.belongsTo(db.Language, { foreignKey: 'language_id', as: 'language' });
db.Language.hasMany(db.Book, { foreignKey: 'language_id' });

// Export roles list if you use it elsewhere
db.ROLES = ['user', 'admin', 'librarian'];

module.exports = db;
