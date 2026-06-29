const supabase = require("../config/supabase");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

exports.getPendingEvents = async (req, res) => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "pending");

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ events: data });
};

exports.approveEvent = async (req, res) => {
  const { id } = req.params;

  const { data: event, error: eventError } = await supabase
    .from("events")
    .update({ status: "approved" })
    .eq("id", id)
    .select()
    .single();

  if (eventError) return res.status(400).json({ error: eventError.message });

  const { data: eventGenres, error: genreError } = await supabase
    .from("event_genres")
    .select("genre_id")
    .eq("event_id", id);

  if (genreError) return res.status(400).json({ error: genreError.message });

  const genreIds = eventGenres.map((g) => g.genre_id);

  if (genreIds.length > 0) {
    const { data: matchingUsers, error: userError } = await supabase
      .from("user_genres")
      .select("user_id")
      .in("genre_id", genreIds);

    if (userError) return res.status(400).json({ error: userError.message });

    const uniqueUserIds = [
      ...new Set(matchingUsers.map((u) => u.user_id)),
    ].filter((uid) => uid !== event.created_by);

    const notifications = uniqueUserIds.map((user_id) => ({
      user_id,
      message: `New event matching your interests: ${event.name} at ${event.location}`,
      read: false,
    }));

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", uniqueUserIds.length > 0 ? uniqueUserIds : [""]);

    if (profiles && profiles.length > 0) {
      await Promise.all(
        profiles.map((profile) =>
          resend.emails.send({
            from: "onboarding@resend.dev",
            to: profile.email,
            subject: "New event matching your music taste!",
            html: `<h2>New Event Alert</h2>
                 <p>A new event matching your interests has been posted:</p>
                 <h3>${event.name}</h3>
                 <p>${event.description}</p>
                 <p>${event.location}</p>
                 <p>${event.date}</p>`,
          }),
        ),
      );
    }

    if (notifications.length > 0) {
      await supabase.from("notifications").insert(notifications);
    }
  }

  res.status(200).json({ message: "Event approved!", event });
};

exports.rejectEvent = async (req, res) => {
  const { id } = req.params;

  const { data: event, error } = await supabase
    .from("events")
    .update({ status: "rejected" })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: "Event rejected!", event });
};

exports.getUsers = async (req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, email, is_admin, created_at");

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ users: data });
};

exports.promoteUser = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("profiles")
    .update({ is_admin: true })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: "User promoted to admin", user: data });
};

exports.getComplaints = async (req, res) => {
  const { data, error } = await supabase
    .from("complaints")
    .select("id, reason, status, created_at, events(name), profiles(username)")
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ complaints: data });
};

exports.reviewComplaint = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("complaints")
    .update({ status: "reviewed" })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res
    .status(200)
    .json({ message: "Complaint marked as reviewed.", complaint: data });
};
