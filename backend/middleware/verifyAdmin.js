const supabase = require("../config/supabase");

const verifyAdmin = async (req, res, next) => {
  const user_id = req.user.id;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user_id)
    .single();

  if (error || !profile || !profile.is_admin) {
    return res.status(403).json({ error: "Admin access required." });
  }

  next();
};

module.exports = verifyAdmin;
