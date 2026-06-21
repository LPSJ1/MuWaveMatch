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
    .select("email")
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

  res.status(200).json({ message: "Login successful!", session: data.session });
};

exports.sendMagicLink = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required." });

  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: "Magic link sent to email" });
};
