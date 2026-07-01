const express = require("express");
const {
  getEvents,
  createEvent,
  getRecommendedEvents,
  rsvpEvent,
  kickAttendee,
  cancelRsvp,
  getMyEvents,
  getEventAttendees,
  getMyRsvps,
} = require("../controllers/eventsController");
const verifyToken = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/", verifyToken, getEvents);
router.get("/mine", verifyToken, getMyEvents);
router.get("/rsvps", verifyToken, getMyRsvps);
router.get("/recommended", verifyToken, getRecommendedEvents);
router.post("/", verifyToken, upload.single("poster"), createEvent);
router.post("/:id/rsvp", verifyToken, rsvpEvent);
router.get("/:id/attendees", verifyToken, getEventAttendees);
router.delete("/:id/attendees/:userId", verifyToken, kickAttendee);
router.delete("/:id/rsvp", verifyToken, cancelRsvp);

module.exports = router;
