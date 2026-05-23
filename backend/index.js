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
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors()); //allows for commuunication with react to the server
app.use(express.json()); //allows the server to read JSON data

//The Test Route
app.get("/", (req, res) => {
  // If someone goes to localhost:3000/, send this one response
  res.json({ message: "the backend is running" });
});

//database route
app.get("/api/genres", async (req, res) => {
  const { data, error } = await supabase.from("genres").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

//turns the server on
app.listen(PORT, () => {
  console.log(`Server is alive and listening on http://localhost:${PORT}`);
});
