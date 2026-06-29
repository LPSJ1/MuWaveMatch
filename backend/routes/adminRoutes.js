const express = require("express");
const {
  getPendingEvents,
  approveEvent,
  rejectEvent,
  getUsers,
  promoteUser,
  getComplaints,
  reviewComplaint,
} = require("../controllers/adminController");
const verifyToken = require("../middleware/auth");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

router.get("/events/pending", verifyToken, verifyAdmin, getPendingEvents);
router.patch("/events/:id/approve", verifyToken, verifyAdmin, approveEvent);
router.patch("/events/:id/reject", verifyToken, verifyAdmin, rejectEvent);
router.get("/users", verifyToken, verifyAdmin, getUsers);
router.patch("/users/:id/promote", verifyToken, verifyAdmin, promoteUser);
router.get("/complaints", verifyToken, verifyAdmin, getComplaints);
router.patch(
  "/complaints/:id/review",
  verifyToken,
  verifyAdmin,
  reviewComplaint,
);

module.exports = router;
