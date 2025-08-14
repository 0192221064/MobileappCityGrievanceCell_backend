const Grievance = require('../models/grievance.model');
const Authority = require('../models/authority.model');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const BASE_WEB_URL = process.env.BASE_WEB_URL || 'http://localhost:5000/grievance';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // Your Gmail
    pass: process.env.EMAIL_PASS        // App password
  }
});

const sendGrievanceLinkToAuthority = async (grievanceId) => {
  const grievance = await Grievance.findById(grievanceId);
  if (!grievance) throw new Error('Grievance not found');

  const department = grievance.title;

  const authority = await Authority.findOne({ department });
  if (!authority || !authority.email) {
    throw new Error(`No authority found for department: ${department}`);
  }

  const link = `${BASE_WEB_URL}/${grievanceId}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: authority.email,
    subject: `🚨 New Grievance Reported for ${department}`,
    html: `
      <p>Hello ${authority.name || 'Authority'},</p>
      <p>A new grievance has been submitted under the <strong>${department}</strong> department.</p>
      <p>📍 Location: ${grievance.location}</p>
      <p><a href="${link}">👉 Click here to view the grievance</a></p>
      <br>
      <p>Regards,<br>City Grievance Cell</p>
    `
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to authority: ${authority.email}`);
};

module.exports = {
  sendGrievanceLinkToAuthority
};
