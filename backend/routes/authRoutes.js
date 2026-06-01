// routes/authRoutes.js
const express = require("express");
const { signUp, login } = require("../controllers/authController");

const router = express.Router();

// Define the routes that point to your controller logic
router.post("/signup", signUp);
router.post("/login", login);

module.exports = router;
