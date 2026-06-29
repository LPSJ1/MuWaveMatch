const supabase = require("../config/supabase");

//Sign-up Logic
exports.signUp = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ error: "Email, username and password are required." });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: data.user.id, username, email, created_at: new Date() });

  if (profileError)
    return res.status(400).json({ error: profileError.message });

  res
    .status(201)
    .json({ message: "User registered successfully!", user: data.user });
};

//Login Logic
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("email, username, is_admin")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    return res.status(400).json({ error: "Invalid username or password." });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password,
  });

  if (error)
    return res.status(400).json({ error: "Invalid username or password." });

  res
    .status(200)
    .json({ message: "Login successful!", session: data.session, profile });
};

exports.sendMagicLink = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required." });

  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: "Magic link sent to email" });
};

exports.getMe = async (req, res) => {
  const user_id = req.user.id;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error || !profile) {
    return res.status(200).json({ profile: null });
  }

  res.status(200).json({ profile });
};

exports.completeProfile = async (req, res) => {
  const { username } = req.body;
  const user_id = req.user.id;
  const email = req.user.email;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .insert({ id: user_id, username, email, created_at: new Date() })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: "Profile created!", profile });
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
    return res.status(404).json({ error: "Event not found" });
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
