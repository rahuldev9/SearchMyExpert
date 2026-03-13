const Notification = require("../models/Notification");

// Get notifications for current user + global notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({
      senderId: { $ne: userId },
      $or: [{ receiverId: userId }, { receiverId: null }],
      deletedBy: { $ne: userId },
    })
      .populate("senderId", "name email")
      .populate("projectId", "title")
      .sort({ createdAt: -1 });

    const result = notifications.map((n) => {
      const obj = n.toObject();

      obj.seen = obj.readBy?.some((id) => id.toString() === userId.toString());

      return obj;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Mark notification as read
exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { readBy: req.user.id } },
      { new: true },
    );

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      $addToSet: { deletedBy: req.user.id },
    });

    res.json({ message: "Notification removed for user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
