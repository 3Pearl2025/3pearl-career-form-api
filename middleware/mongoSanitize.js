// src/core/middleware/mongoSanitize.ts
import mongoSanitize from "express-mongo-sanitize";

export const mongoSanitizeCustom = (req, res, next) => {
  try {
    // Sanitize body
    if (req.body) mongoSanitize.sanitize(req.body);

    // Sanitize query params
    if (req.query) mongoSanitize.sanitize(req.query);

    // Sanitize route params
    if (req.params) mongoSanitize.sanitize(req.params);

    next();
  } catch (err) {
    console.error("❌ Mongo sanitize error:", err);
    next(err);
  }
};
