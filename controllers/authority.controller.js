const Authority = require('../models/authority.model');

// ✅ KEEP THIS — Get all authorities
exports.getAllAuthorities = async (req, res) => {
  try {
    const authorities = await Authority.find();
    res.status(200).json(authorities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

