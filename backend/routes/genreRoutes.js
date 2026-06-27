const express = require("express");
const { getGenres } = require("../controllers/genreController");
const verifyToken = require("../middleware/auth");

const router = express.Router();
router.get("/", verifyToken, getGenres);
module.exports = router;
