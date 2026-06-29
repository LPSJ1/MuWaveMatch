const express = require("express");
const { submitComplaint } = require("../controllers/complaintController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/", verifyToken, submitComplaint);

module.exports = router;
