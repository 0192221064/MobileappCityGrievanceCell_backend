// notification.service.js
const admin = require('./firebase');

const sendPushNotification = async (fcmToken, title, body) => {
  const message = {
    token: fcmToken, // device token from frontend app
    notification: {
      title,
      body,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent successfully:', response);
  } catch (error) {
    console.error('❌ Error sending notification:', error);
  }
};

module.exports = { sendPushNotification };
