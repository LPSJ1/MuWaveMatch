const supabase = require("../config/supabase");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

//Get all events
exports.getEvents = async (req, res) => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved");

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ events: data });
};

//create a new event
exports.createEvent = async (req, res) => {
  const { name, description, location, date, genre_ids, lat, lng } = req.body;
  const created_by = req.user.id;

  if (!name || !date || !location) {
    return res
      .status(400)
      .json({ error: "Name, date and location are required" });
  }

  //Creating event
  const { data: event, error: eventError } = await supabase
    .from("events")
    .insert({ name, description, location, date, created_by, lat, lng })
    .select()
    .single();

  if (eventError) return res.status(400).json({ error: eventError.message });

  //Linking genres to the event
  if (genre_ids && genre_ids.length > 0) {
    const eventGenreRows = genre_ids.map((genre_id) => ({
      event_id: event.id,
      genre_id,
    }));

    const { error: genreError } = await supabase
      .from("event_genres")
      .insert(eventGenreRows);

    if (genreError) return res.status(400).json({ error: genreError.message });
  }

  res.status(201).json({ message: "Event created!", event });
};

exports.getRecommendedEvents = async (req, res) => {
  const user_id = req.user.id;

  //Getting user's genres
  const { data: userGenres, error: genreError } = await supabase
    .from("user_genres")
    .select("genre_id")
    .eq("user_id", user_id);

  if (genreError) return res.status(400).json({ error: genreError.message });

  const genreIds = userGenres.map((g) => g.genre_id);

  //finding events matching the genres
  const { data: eventGenres, error: eventError } = await supabase
    .from("event_genres")
    .select("event_id")
    .in("genre_id", genreIds);

  if (eventError) return res.status(400).json({ error: eventError.message });

  const eventIds = eventGenres.map((e) => e.event_id);

  //Fetching those events
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .in("id", eventIds)
    .eq("status", "approved");

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ events: data });
};

exports.rsvpEvent = async (req, res) => {
  const { id: event_id } = req.params;
  const user_id = req.user.id;

  const { error } = await supabase
    .from("event_rsvps")
    .insert({ event_id, user_id });

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: "RSVP successful!" });
};
