// backend/utils/notifyAuthority.js

const nodemailer = require('nodemailer');

async function notifyAuthority(email, subject, message) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: message
  });
}

module.exports = notifyAuthority;
