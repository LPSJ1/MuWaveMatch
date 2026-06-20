const express = require("express");
const {
  saveInterest,
  getMyInterests,
} = require("../controllers/interestController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/", verifyToken, saveInterest);
router.get("/me", verifyToken, getMyInterests);

module.exports = router;
