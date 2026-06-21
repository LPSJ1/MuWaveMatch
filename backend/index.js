// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables here

// Import your maps (the Routes)
const authRoutes = require("./routes/authRoutes");
const interestRoutes = require("./routes/interestRoutes");
const matchRoutes = require("./routes/matchRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// 1. Global Middleware
app.use(cors());
app.use(express.json());

// 2. The Switchboard
// Any request that starts with /api is routed to its handler
app.use("/api/match", matchRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/interests", interestRoutes);
app.use("/api", authRoutes);

// 3. Health Check
app.get("/", (req, res) => {
  res.send("MusicMatch API is live.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
