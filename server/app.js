import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import routes from "./routes/index.js";       
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import languageRoute from "./routes/languageRoute.js";
import { initI18n } from "./middlewares/i18n.js";

import './cron/sendReminders.js';
import './cron/sendEmailUser.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(initI18n); // ✅ now attaches req.getLocale() and req.setLocale()

// Static files for uploads
app.use("/uploads", express.static(path.join(process.cwd(), "Uploads")));
app.use("/uploads/users", express.static(path.join(process.cwd(), "Uploads/users")));

// Routes
app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/languages", languageRoute);

export default app;
