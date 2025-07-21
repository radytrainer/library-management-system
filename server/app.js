// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');
const routes = require('./routes');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api', routes);

// Database sync (without starting server)
db.sequelize.sync()
  .then(() => console.log("Database synced"))
  .catch(err => console.error("Failed to sync db:", err));

module.exports = app;

