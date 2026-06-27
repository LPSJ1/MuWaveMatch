const express = require("express");
const { getMatches } = require("../controllers/matchController");
const verifyToken = require("../middleware/auth");

const router = express.Router();
router.get("/", verifyToken, getMatches);
module.exports = router;
