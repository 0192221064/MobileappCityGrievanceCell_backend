const crypto = require('crypto');
const axios = require('axios');
const Location = require('../models/location.model');

exports.shareLocation = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  const token = crypto.randomBytes(6).toString('hex');
  const shareUrl = `https://citygrievancecell.com/location/${token}`;

  try {
    // ✅ Save to MongoDB
    const newLocation = new Location({ latitude, longitude, token });
    await newLocation.save();

    res.status(200).json({
      message: 'Shareable location generated and saved',
      url: shareUrl,
      token,
      coordinates: { latitude, longitude }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error saving location to DB',
      error: error.message
    });
  }
};

// Search by name (autocomplete)
exports.searchLocation = async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Query parameter is required' });
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 5
      },
      headers: { 'User-Agent': 'CityGrievanceApp/1.0' }
    });

    const results = response.data.map(place => ({
      name: place.display_name,
      lat: place.lat,
      lon: place.lon
    }));

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching location data', error: error.message });
  }
};

// Reverse geocoding
exports.reverseGeocode = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon,
        format: 'json',
        addressdetails: 1
      },
      headers: { 'User-Agent': 'GrievanceApp/1.0' }
    });

    const locationName = response.data.display_name;

    res.status(200).json({
      success: true,
      location: locationName
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Reverse geocoding failed',
      error: error.message
    });
  }
};
