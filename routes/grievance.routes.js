const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  createGrievance,
  getAllGrievances,
  getIssueTypes
} = require('../controllers/grievance.controller');

router.post('/report', upload.single('media'), createGrievance);
router.get('/', getAllGrievances);
router.get('/types', getIssueTypes);

const Grievance = require('../models/grievance.model');

router.get('/grievance/:id', async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) return res.status(404).send('Grievance not found');
    res.render('grievance', { grievance });
  } catch (err) {
    res.status(500).send('Server error');
  }
});


module.exports = router;
