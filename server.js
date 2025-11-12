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
import { mongoSanitizeCustom } from "./middleware/mongoSanitize.js";
import { fileURLToPath } from "url";
import helmet from "helmet";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:4000",
      "http://localhost:3000",
      "http://192.168.1.119:3000",
      "http://192.168.1.119:4000",
    ],
    credentials: true,
  })
);
app.use(helmet);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());

app.use(mongoSanitizeCustom);

// Apply general limit to all routes
app.use("/api/", apiLimiter);

// Apply strict limit to login route
app.use("/api/auth/login", loginLimiter);

// 🧾 Log every request
app.use(requestLogger);

// Connect Database
connectDB();

// Serve static files with proper URL decoding
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// OR if you want more control, use a custom route:
app.get("/uploads/:filename", (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(__dirname, "uploads", filename);

    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send("File not found");
      }
    });
  } catch (error) {
    res.status(400).send("Invalid filename");
  }
});

// --- Add this health route ---
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 🔗 Register Routes
app.use("/api/applicants", applicantRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
