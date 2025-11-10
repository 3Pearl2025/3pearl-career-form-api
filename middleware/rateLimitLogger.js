import rateLimit from "express-rate-limit";
import Log from "../models/Log.js";

// Helper to log rate limit hits
async function logRateLimit(req, message) {
  try {
    await Log.create({
      ip: req.ip,
      endpoint: req.originalUrl,
      method: req.method,
      message,
    });
  } catch (err) {
    console.error("⚠️ Failed to log rate limit:", err);
  }
}

// Create general API limiter with logging
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // TODO: Change this to 100
  handler: async (req, res, next) => {
    const msg = "Too many requests from this IP. Please try again later.";
    await logRateLimit(req, msg);
    res.status(429).json({ success: false, message: msg });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create login limiter with stricter rules and logging
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  handler: async (req, res, next) => {
    const msg = "Too many login attempts. Please try again after 15 minutes.";
    await logRateLimit(req, msg);
    res.status(429).json({ success: false, message: msg });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
