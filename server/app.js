import express from "express";
import cors from "cors";
import path from 'path';
import dotenv from "dotenv";
import db from "./models/index.js";
import routes from "./routes/index.js";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("Uploads"));
app.use("/uploads/users", express.static(path.join(process.cwd(), "Uploads/users")));

app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

db.sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Failed to sync db:", err));

export default app;