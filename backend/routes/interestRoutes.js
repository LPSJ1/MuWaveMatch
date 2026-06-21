const express = require("express");
const {
  saveInterest,
  removeInterest,
  getMyInterests,
} = require("../controllers/interestController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/", verifyToken, saveInterest);
router.get("/me", verifyToken, getMyInterests);
router.delete("/:genre_id", verifyToken, removeInterest);

module.exports = router;
