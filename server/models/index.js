const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
const UserModel = require("./user");
const RoleModel = require("./role");
const BookModel = require("./book");
const CategoryModel = require("./categories");
const AuthorModel = require("./author");
const BorrowModel = require("./borrow");
const LanguageModel = require("./languageBook");

// Initialize models
db.User = UserModel(sequelize, Sequelize.DataTypes);
db.Role = RoleModel(sequelize, Sequelize.DataTypes);
db.Book = BookModel(sequelize, Sequelize.DataTypes);
db.Category = CategoryModel(sequelize, Sequelize.DataTypes);
db.Author = AuthorModel(sequelize, Sequelize.DataTypes);
db.Borrow = BorrowModel(sequelize, Sequelize.DataTypes);
db.Language = LanguageModel(sequelize, Sequelize.DataTypes);

// Associations (adjust as per your design)

// One-to-Many: Role -> Users
db.Role.hasMany(db.User, { foreignKey: "roleId", as: "Users" });
db.User.belongsTo(db.Role, { foreignKey: "roleId", as: "Role" });  // Note singular alias 'Role'


// Book belongs to Category and Author
db.Book.belongsTo(db.Category);
db.Category.hasMany(db.Book);

db.Book.belongsTo(db.Author);
db.Author.hasMany(db.Book);

// Book has a Language
db.Book.belongsTo(db.Language, { foreignKey: "language_id", as: "language" });
db.Language.hasMany(db.Book, { foreignKey: "language_id" });

// Borrow associations
db.Borrow.belongsTo(db.User, { as: "user", foreignKey: "user_id" });
db.Borrow.belongsTo(db.User, { as: "librarian", foreignKey: "librarian_id" });
db.Borrow.belongsTo(db.Book, { as: "book", foreignKey: "book_id" });

db.User.hasMany(db.Borrow, { foreignKey: "user_id" });
db.User.hasMany(db.Borrow, { as: "librarianBorrows", foreignKey: "librarian_id" });
db.Book.hasMany(db.Borrow, { foreignKey: "book_id" });

module.exports = db;
