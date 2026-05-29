// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables here

// Import your maps (the Routes)
const authRoutes = require("./routes/authRoutes");

const app = express();

// 1. Global Middleware (The Intake Valves)
app.use(cors());
app.use(express.json());

// 2. The Switchboard (Directing traffic)
// Any request that starts with /api will be handled by authRoutes
app.use("/api", authRoutes);

// 3. Health Check
app.get("/", (req, res) => {
  res.send("MusicMatch API is live.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
