const express = require("express");
const {
  getEvents,
  createEvent,
  getRecommendedEvents,
} = require("../controllers/eventsController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyToken, getEvents);
router.get("/recommended", verifyToken, getRecommendedEvents);
router.post("/", verifyToken, createEvent);

module.exports = router;
