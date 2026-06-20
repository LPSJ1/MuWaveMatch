const supabase = require("../config/supabase");

//save a genre to the logged in user's interests
exports.saveInterest = async (req, res) => {
  const { genre_id } = req.body;
  const user_id = req.user.id;

  if (!genre_id) {
    return res.status(400).json({ error: "Genre is required" });
  }

  const { data, error } = await supabase
    .from("user_genres")
    .insert({ user_id, genre_id });

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: "Interest saved!", data });
};

//Get all genres belonging to the logged-in user
exports.getMyInterests = async (req, res) => {
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("user_genres")
    .select("*")
    .eq("user_id", user_id);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ interests: data });
};
