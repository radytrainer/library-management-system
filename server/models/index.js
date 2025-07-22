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

// Setup associations

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

// Book belongs to Category and Author
db.Book.belongsTo(db.Category);
db.Category.hasMany(db.Book);

db.Book.belongsTo(db.Author);
db.Author.hasMany(db.Book);

// Define any other associations you have, for example Borrow relations
db.Borrow.belongsTo(db.User, { as: 'user', foreignKey: 'user_id' });
db.Borrow.belongsTo(db.User, { as: 'librarian', foreignKey: 'librarian_id' });
db.Borrow.belongsTo(db.Book, { as: 'book', foreignKey: 'book_id' });

db.User.hasMany(db.Borrow, { foreignKey: 'user_id' });
db.User.hasMany(db.Borrow, { as: 'librarianBorrows', foreignKey: 'librarian_id' });
db.Book.hasMany(db.Borrow, { foreignKey: 'book_id' });
db.Book.belongsTo(db.Language, { foreignKey: 'language_id', as: 'language' });
db.Language.hasMany(db.Book, { foreignKey: 'language_id' });



module.exports = db;
