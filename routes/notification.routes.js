const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markAllAsRead,
  sendNotification
} = require('../controllers/notification.controller');

router.get('/', getUserNotifications);             // GET /api/notifications
router.put('/mark-read', markAllAsRead);           // PUT /api/notifications/mark-read
router.post('/send', sendNotification);            // ✅ POST /api/notifications/send

module.exports = router;

