// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');
const routes = require('./routes');
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");



dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api', routes);

// Routes registration user
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Database sync (without starting server)
db.sequelize.sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch(err => console.error("Failed to sync db:", err));
module.exports = app;