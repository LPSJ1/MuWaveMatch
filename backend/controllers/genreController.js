const supabase = require("../config/supabase");

exports.getGenres = async (req, res) => {
  const { data, error } = await supabase.from("genres").select("*");

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ genres: data });
};
