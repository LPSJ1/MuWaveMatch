const supabase = require("../config/supabase");

exports.getMatches = async (req, res) => {
  const my_user_id = req.user.id;

  //Getting the logged-in user's genres
  const { data: myGenres, error: myError } = await supabase
    .from("user_genres")
    .select("genre_id")
    .eq("user_id", my_user_id);

  if (myError) return res.status(400).json({ error: myError.message });

  //Getting all other user's genres
  const { data: allGenres, error: allError } = await supabase
    .from("user_genres")
    .select("user_id, genre_id")
    .neq("user_id", my_user_id);

  if (allError) return res.status(400).json({ error: allError.message });

  //group genres by user
  const userMap = {};
  for (const row of allGenres) {
    if (!userMap[row.user_id]) userMap[row.user_id] = [];
    userMap[row.user_id].push(row.genre_id);
  }

  //Run Jccard on each user
  const mySet = new Set(myGenres.map((g) => g.genre_id));

  const matches = Object.entries(userMap).map(([userId, genres]) => {
    const theirSet = new Set(genres);
    const intersection = [...mySet].filter((g) => theirSet.has(g)).length;
    const union = new Set([...mySet, ...theirSet]).size;
    const score = union == 0 ? 0 : intersection / union;

    return { user_id: userId, score: parseFloat(score.toFixed(2)) };
  });

  //sorting by score in descending
  matches.sort((a, b) => b.score - a.score);

  res.status(200).json({ matches });
};
