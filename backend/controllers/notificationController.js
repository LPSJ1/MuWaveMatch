const supabase = require("../config/supabase");

// Get all notifications for the logged-in user
exports.getNotifications = async (req, res) => {
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user_id)
    .order("ceated_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ notification: data });
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  const { notification_id } = req.body;
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notification_id)
    .eq("user_id", user_id);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: "Notification marked as a read", data });
};
