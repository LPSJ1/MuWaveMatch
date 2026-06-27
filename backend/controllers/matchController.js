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

  //Run Jaccard on each user
  const mySet = new Set(myGenres.map((g) => g.genre_id));

  const rawMatches = Object.entries(userMap).map(([userId, genres]) => {
    const theirSet = new Set(genres);
    const sharedGenreIds = [...mySet].filter((g) => theirSet.has(g));
    const union = new Set([...mySet, ...theirSet]).size;
    const score = union == 0 ? 0 : sharedGenreIds.length / union;

    return { user_id: userId, score, sharedGenreIds };
  });

  //sorting by score in descending
  rawMatches.sort((a, b) => b.score - a.score);

  const matchedUserIds = rawMatches.map((m) => m.user_id);
  const allSharedGenreIds = [
    ...new Set(rawMatches.flatMap((m) => m.sharedGenreIds)),
  ];

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, username")
    .in("id", matchedUserIds.length > 0 ? matchedUserIds : [""]);

  if (profileError)
    return res.status(400).json({ error: profileError.message });

  const profileMap = {};
  for (const p of profiles) profileMap[p.id] = p;

  const { data: genreNames, error: genreError } = await supabase
    .from("genres")
    .select("id, name")
    .in("id", allSharedGenreIds.length > 0 ? allSharedGenreIds : [""]);

  if (genreError) return res.status(400).json({ error: genreError.message });

  const genreNameMap = {};
  for (const g of genreNames) genreNameMap[g.id] = g.name;

  const matches = rawMatches.map((m) => ({
    user_id: m.user_id,
    user_name: profileMap[m.user_id]?.username || "Unknown",
    match_score: Math.round(m.score * 100),
    shared_genres: m.sharedGenreIds.map((id) => genreNameMap[id]),
  }));
  res.status(200).json({ matches });
};
