// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Library Management System API');
});

// Book routes
app.use('/api/books', require('./routes/bookRoutes'));

// User routes
app.use('/api/users', require('./routes/userRoutes'));

// Database sync (without starting server)
db.sequelize.sync()
  .then(() => console.log("Database synced"))
  .catch(err => console.error("Failed to sync db:", err));

module.exports = app;

