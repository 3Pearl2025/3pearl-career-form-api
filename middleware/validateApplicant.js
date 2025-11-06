// middleware/validateApplicant.js
import { body, validationResult } from "express-validator";

export const applicantValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters")
    .escape(),

  body("position")
    .trim()
    .notEmpty()
    .withMessage("Position is required")
    .escape(),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("City must contain only letters")
    .escape(),
];

export const validateApplicant = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};
