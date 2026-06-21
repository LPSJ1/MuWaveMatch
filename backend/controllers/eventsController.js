const supabase = require("../config/supabase");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

//Get all events
exports.getEvents = async (req, res) => {
  const { data, error } = await supabase.from("events").select("*");

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ events: data });
};

//create a new event
exports.createEvent = async (req, res) => {
  const { name, description, location, date, genre_ids } = req.body;
  const created_by = req.user.id;

  if (!name || !date || !location) {
    return res
      .status(400)
      .json({ error: "Name, date and location are required" });
  }

  //Creating event
  const { data: event, error: eventError } = await supabase
    .from("events")
    .insert({ name, description, location, date, created_by })
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

    //find users who like those genres
    const { data: matchingUsers, error: userError } = await supabase
      .from("user_genres")
      .select("user_id")
      .in("genre_id", genre_ids);

    if (userError) return res.status(400).json({ error: userError.message });

    //Create notifications for those users
    const uniqueUserIds = [...new Set(matchingUsers.map((u) => u.user_id))];

    const notifications = uniqueUserIds
      .filter((id) => id !== created_by)
      .map((user_id) => ({
        user_id,
        message: `New event matching your interests: ${name} at ${location}`,
        read: false,
      }));

    //Send emails to matching users
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email")
      .in(
        "id",
        uniqueUserIds.filter((id) => id !== created_by),
      );

    if (profiles && profiles.length > 0) {
      await Promise.all(
        profiles.map((profile) =>
          resend.emails.send({
            from: "onboarding@resend.dev",
            to: profile.email,
            subject: "New event matching your music taste!",
            html: `<h2>New Event Alert</h2>
                   <p>A new event matching your interests has been posted:</p>
                   <h3>${name}</h3>
                   <p>${description}</p>
                   <p>${location}</p>
                   <p>${date}</p>`,
          }),
        ),
      );
    }

    if (notifications.length > 0) {
      await supabase.from("notifications").insert(notifications);
    }
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
    .in("id", eventIds);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ events: data });
};
