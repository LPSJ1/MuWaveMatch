// index.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config(); // Load environment variables here

// Import your maps (the Routes)
const authRoutes = require("./routes/authRoutes");
const genreRoutes = require("./routes/genreRoutes");
const interestRoutes = require("./routes/interestRoutes");
const matchRoutes = require("./routes/matchRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
});

const app = express();

// 1. Global Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(limiter);

// 2. The Switchboard
// Any request that starts with /api is routed to its handler
app.use("/api/match", matchRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/interests", interestRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", authRoutes);
app.use("/api/complaints", complaintRoutes);
// 3. Health Check
app.get("/", (req, res) => {
  res.send("MusicMatch API is live.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
