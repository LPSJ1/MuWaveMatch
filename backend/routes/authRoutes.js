// routes/authRoutes.js
const express = require("express");
const {
  signUp,
  login,
  sendMagicLink,
} = require("../controllers/authController");

const router = express.Router();

// Define the routes that point to the controller logic
router.post("/signup", signUp);
router.post("/magic-link", sendMagicLink);
router.post("/login", login);

module.exports = router;
