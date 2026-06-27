// routes/authRoutes.js
const express = require("express");
const {
  signUp,
  login,
  sendMagicLink,
} = require("../controllers/authController");

const {
  validateSignup,
  validateLogin,
  handleValidationErrors,
} = require("../middleware/validators");

const router = express.Router();

// Define the routes that point to the controller logic
router.post("/signup", validateSignup, handleValidationErrors, signUp);
router.post("/magic-link", sendMagicLink);
router.post("/login", validateLogin, handleValidationErrors, login);

module.exports = router;
