import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import db from "./models/index.js";
import routes from "./routes/index.js";       // centralized routes
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files for uploads (adjust folder names exactly)
app.use("/uploads", express.static(path.join(process.cwd(), "Uploads")));
app.use("/uploads/users", express.static(path.join(process.cwd(), "Uploads/users")));

// API routes
app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

export default app;
