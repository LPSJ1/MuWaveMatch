const supabase = require("../config/supabase");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

//Get all events
exports.getEvents = async (req, res) => {
  const { data, error } = await supabase
    .from("events")
    .select("*, event_genres(genres(name))")
    .eq("status", "approved");

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ events: data });
};

//create a new event
exports.createEvent = async (req, res) => {
  const { name, description, location, date, lat, lng } = req.body;
  const created_by = req.user.id;

  let genre_ids = req.body.genre_ids;
  if (typeof genre_ids === "string") {
    genre_ids = JSON.parse(genre_ids);
  }

  if (!name || !date || !location) {
    return res
      .status(400)
      .json({ error: "Name, date and location are required" });
  }

  let poster_url = null;

  if (req.file) {
    const fileName = `${Date.now()}-${req.file.originalname}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("event-posters")
      .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

    if (uploadError)
      return res.status(400).json({ error: uploadError.message });

    const { data: urlData } = supabase.storage
      .from("event-posters")
      .getPublicUrl(uploadData.path);

    poster_url = urlData.publicUrl;
  }
  //Creating event
  const { data: event, error: eventError } = await supabase
    .from("events")
    .insert({
      name,
      description,
      location,
      date,
      created_by,
      lat,
      lng,
      poster_url,
    })
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

exports.kickAttendee = async (req, res) => {
  const { id: event_id, userId } = req.params;
  const requester_id = req.user.id;

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("created_by")
    .eq("id", event_id)
    .single();

  if (eventError || !event) {
    return res.status(404).json({ error: "Event not found." });
  }

  if (event.created_by !== requester_id) {
    return res
      .status(403)
      .json({ error: "Only the event organizer can remove attendees." });
  }

  const { error } = await supabase
    .from("event_rsvps")
    .delete()
    .eq("event_id", event_id)
    .eq("user_id", userId);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: "Attendee removed from event." });
};

exports.cancelRsvp = async (req, res) => {
  const { id: event_id } = req.params;
  const user_id = req.user.id;

  const { error } = await supabase
    .from("event_rsvps")
    .delete()
    .eq("event_id", event_id)
    .eq("user_id", user_id);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: "Registration cancelled." });
};

exports.getMyRsvps = async (req, res) => {
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("event_rsvps")
    .select("event_id, events(id, name, description, location, date)")
    .eq("user_id", user_id);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ rsvps: data });
};

exports.getMyEvents = async (req, res) => {
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("created_by", user_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ events: data });
};

exports.getEventAttendees = async (req, res) => {
  const { id: event_id } = req.params;
  const requester_id = req.user.id;

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("created_by")
    .eq("id", event_id)
    .single();

  if (eventError || !event) {
    return res.status(404).json({ error: "Event not found." });
  }

  if (event.created_by !== requester_id) {
    return res.status(403).json({ error: "Only the event organizer can view attendees." });
  }

  const { data, error } = await supabase
    .from("event_rsvps")
    .select("user_id, profiles(username, email)")
    .eq("event_id", event_id);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ attendees: data });
};
