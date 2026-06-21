const { body, validationResult } = require("express-validator");

exports.validateSignup = [
  body("email").isEmail().withMessage("Please provide a valid email address."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters."),
];

exports.validateLogin = [
  body("username").trim().notEmpty().withMessage("Username is required."),
  body("password").notEmpty().withMessage("Password is required."),
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};
