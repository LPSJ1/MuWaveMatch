const supabase = require("../config/supabase");

exports.getNotifications = async (req, res) => {
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ notifications: data });
};

exports.markAsRead = async (req, res) => {
  const { notification_id } = req.body;
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notification_id)
    .eq("user_id", user_id);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: "Notification marked as read", data });
};
