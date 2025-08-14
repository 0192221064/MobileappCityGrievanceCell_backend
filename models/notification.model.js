const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  message: String,
  icon: String, // e.g., 'pothole', 'light', 'trash', 'resolved'
  status: { type: String, enum: ['new', 'resolved'], default: 'new' },
  isRead: { type: Boolean, default: false },
  location: {
    name: String,         // e.g., "Main Street"
    distance: Number      // in meters
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
