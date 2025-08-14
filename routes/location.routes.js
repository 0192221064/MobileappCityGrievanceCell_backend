console.log("📍 Location routes loaded");

const express = require('express');
const router = express.Router();

const {
  shareLocation,
  searchLocation,
  reverseGeocode
} = require('../controllers/location.controller');

router.post('/share', shareLocation);
router.get('/search', searchLocation);
router.get('/reverse', reverseGeocode);

module.exports = router;
