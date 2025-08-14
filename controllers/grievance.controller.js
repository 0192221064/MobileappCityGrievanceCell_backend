const Grievance = require('../models/grievance.model');
const path = require('path');
const { sendGrievanceLinkToAuthority } = require('../services/linkgeneration.service'); // ✅ Correct import

// Submit a grievance with media
exports.createGrievance = async (req, res) => {
  try {
    const { title, description, location, user } = req.body;
    const media = req.file ? req.file.filename : null;

    const grievance = new Grievance({
      title,
      description,
      location,
      user,
      media
    });

    await grievance.save();

    // ✅ Send link and WhatsApp message after saving
    await sendGrievanceLinkToAuthority(grievance._id);

    res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully',
      grievance
    });
  } catch (error) {
    console.error('❌ Grievance Submission Error:', error);
    res.status(500).json({ message: 'Error submitting grievance', error: error.message });
  }
};

// Get all grievances
exports.getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find().populate('user', 'email');
    res.status(200).json({ success: true, grievances });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grievances', error });
  }
};

// Get available issue types
exports.getIssueTypes = (req, res) => {
  const issueTypes = [
    'Electricity',
    'Garbage',
    'Parking',
    'Roads',
    'Water',
    'Drainage'
  ];

  res.status(200).json({ success: true, types: issueTypes });
};
