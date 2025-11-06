import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import { requestLogger } from "./middleware/logger.js";
import applicantRoutes from "./routes/applicantRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { apiLimiter, loginLimiter } from "./middleware/rateLimitLogger.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:4000", credentials: true }));
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());

// Apply general limit to all routes
app.use("/api/", apiLimiter);

// Apply strict limit to login route
app.use("/api/auth/login", loginLimiter);

// 🧾 Log every request
app.use(requestLogger);

// Connect Database
connectDB();

// 🔗 Register Routes
app.use("/api/applicants", applicantRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
