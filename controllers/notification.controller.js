const mongoose = require('mongoose');
const Notification = require('../models/notification.model');

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.query.userId; // 📌 passed as query param

    if (!userId) return res.status(400).json({ message: 'Missing userId' });

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    const newIssues = notifications.filter(n => n.status === 'new');
    const resolved = notifications.filter(n => n.status === 'resolved');

    res.json({
      success: true,
      notifications: {
        newIssues,
        resolved
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching notifications', error: err });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid or missing userId' });
    }

    const result = await Notification.updateMany(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $set: { isRead: true } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No notifications found for this user' });
    }

    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to mark as read', error: err.message });
  }
};


exports.sendNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ success: false, message: 'userId and message required' });
    }

    const notification = new Notification({
      userId,
      message,
      isRead: false,
      createdAt: new Date()
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send notification', error: error.message });
  }
};

