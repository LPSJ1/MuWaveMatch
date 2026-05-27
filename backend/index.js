//Importing of packages by defining them with a contant that is their name

const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("dotenv").config({ path: __dirname + "/.env" });
const { createClient } = require("@supabase/supabase-js");

//initialize the app with the express package
const app = express();

const PORT = 3000;

//Initializing Supabase Connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const communityUsers = [
  { id: 1, name: "Aria", interests: ["afrobeats", "rnb", "pop"] },
  { id: 2, name: "Miles", interests: ["jazz", "rnb", "neo-soul"] },
  { id: 3, name: "Kai", interests: ["house", "afrobeats", "electronic"] },
  { id: 4, name: "Noah", interests: ["rock", "indie", "pop"] },
];

const events = [
  { id: "evt-1", name: "Neon Groove Nights", city: "Lagos", genre: "afrobeats" },
  { id: "evt-2", name: "Soul Frequency Live", city: "London", genre: "rnb" },
  { id: "evt-3", name: "Blue Note Sessions", city: "New York", genre: "jazz" },
  { id: "evt-4", name: "Midnight Bassline", city: "Berlin", genre: "electronic" },
  { id: "evt-5", name: "Indie City Fest", city: "Toronto", genre: "indie" },
];

const normalizeInterests = (interests = []) =>
  interests
    .filter((interest) => typeof interest === "string")
    .map((interest) => interest.trim().toLowerCase())
    .filter(Boolean);

const findMatches = (rawInterests = []) => {
  const normalizedUserInterests = normalizeInterests(rawInterests);

  return communityUsers
    .map((member) => {
      const memberInterests = normalizeInterests(member.interests);
      const sharedInterests = memberInterests.filter((interest) =>
        normalizedUserInterests.includes(interest)
      );
      return { ...member, sharedInterests, score: sharedInterests.length };
    })
    .filter((member) => member.score > 0)
    .sort((a, b) => b.score - a.score);
};

const discoverEvents = ({ interests = [], city = "" } = {}) => {
  const normalizedInterests = normalizeInterests(interests);

  return events.filter((event) => {
    const cityMatch = city ? event.city.toLowerCase() === city.toLowerCase() : true;
    const interestMatch = normalizedInterests.length
      ? normalizedInterests.includes(event.genre.toLowerCase())
      : true;
    return cityMatch && interestMatch;
  });
};

app.use(cors()); //allows for communication with react to the server
app.use(express.json()); //allows the server to read JSON data

//The Test Route
app.get("/", (req, res) => {
  // If someone goes to localhost:3000/, send this one response
  res.json({ message: "the backend is running" });
});

//database route
app.get("/api/genres", async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: "Supabase is not configured" });
  }

  const { data, error } = await supabase.from("genres").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post("/api/matches", (req, res) => {
  const userInterests = normalizeInterests(req.body?.interests);

  if (!userInterests.length) {
    return res.status(400).json({ error: "Please provide at least one interest" });
  }

  res.json(findMatches(userInterests));
});

app.get("/api/events/discover", (req, res) => {
  const interestQuery = typeof req.query.interests === "string" ? req.query.interests : "";
  const interests = normalizeInterests(interestQuery ? interestQuery.split(",") : []);
  const city = typeof req.query.city === "string" ? req.query.city.trim() : "";
  res.json(discoverEvents({ interests, city }));
});

//turns the server on
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is alive and listening on http://localhost:${PORT}`);
  });
}

module.exports = { app, findMatches, discoverEvents };
