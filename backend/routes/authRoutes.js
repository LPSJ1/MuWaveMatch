// routes/authRoutes.js
const express = require("express");
const {
  signUp,
  login,
  sendMagicLink,
  getMe,
  completeProfile,
} = require("../controllers/authController");

const {
  validateSignup,
  validateLogin,
  handleValidationErrors,
} = require("../middleware/validators");

const router = express.Router();
const verifyToken = require("../middleware/auth");

// Define the routes that point to the controller logic
router.post("/signup", validateSignup, handleValidationErrors, signUp);
router.post("/magic-link", sendMagicLink);
router.get("/me", verifyToken, getMe);
router.post("/complete-profile", verifyToken, completeProfile);
router.post("/login", validateLogin, handleValidationErrors, login);

module.exports = router;
