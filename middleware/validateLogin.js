import { body, validationResult } from "express-validator";

// Validation chain for login
export const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  // Middleware to handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: errors.array(),
      });
    }
    next();
  },
];
