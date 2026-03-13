const router = require("express").Router();

const {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

// Get all notifications for current user
router.get("/", protect, getNotifications);

// Mark notification as read
router.patch("/:id/read", protect, markNotificationRead);

// Delete a notification
router.delete("/:id", protect, deleteNotification);

module.exports = router;
