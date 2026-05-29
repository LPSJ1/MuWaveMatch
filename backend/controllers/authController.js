const supabase = require("../config/supabase");

//Sign-up Logic
exports.signUp = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return req.status(400).json({ error: "Email and password are required." });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  res
    .status(201)
    .json({ message: "User registered successfully!", user: data.user });
};

//Login Logic
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error)
    return res.status(400).json({ error: "Invalid email or password." });

  res.status(200).json({ message: "Login successful!", session: data.session });
};
