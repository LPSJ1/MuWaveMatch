const supabase = require("../config/supabase");

exports.submitComplaint = async (req, res) => {
  const { event_id, reason } = req.body;
  const reported_by = req.user.id;

  if (!event_id || !reason) {
    return res.status(400).json({ error: "Event and reason are required." });
  }

  const { data, error } = await supabase
    .from("complaints")
    .insert({ event_id, reported_by, reason })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: "Complaint Submitted!", complaint: data });
};
