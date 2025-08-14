const express = require('express');
const router = express.Router();
const Authority = require('../models/authority.model');

// Get authority by department
router.get('/:department', async (req, res) => {
  try {
    const department = req.params.department;
    const authority = await Authority.findOne({ department });

    if (!authority) {
      return res.status(404).json({ message: 'Authority not found' });
    }

    res.json(authority);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
