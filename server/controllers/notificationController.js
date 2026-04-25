const Notification = require("../models/Notification");

// -----------------------------------------------
// @desc    Get all notifications for logged in user
// @route   GET /api/notifications
// @access  Private
// -----------------------------------------------
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------
// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
// -----------------------------------------------
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    notification.isRead = true;
    await notification.save();
    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------
// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
// -----------------------------------------------
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };