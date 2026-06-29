const express = require("express");
const {
  getEvents,
  createEvent,
  getRecommendedEvents,
  rsvpEvent,
  kickAttendee,
} = require("../controllers/eventsController");
const verifyToken = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/", verifyToken, getEvents);
router.get("/recommended", verifyToken, getRecommendedEvents);
router.post("/", verifyToken, upload.single("poster"), createEvent);
router.post("/:id/rsvp", verifyToken, rsvpEvent);
router.delete("/:id/attendees/:userId", verifyToken, kickAttendee);

module.exports = router;
