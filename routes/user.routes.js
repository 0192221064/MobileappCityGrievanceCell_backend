const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');


console.log('✅ user.routes.js loaded');

const {
  createUser,
  getAllUsers,
  userDetails,
  loginUser,
  forgotPassword,
  verifyCode,
  resetPassword,
  getCurrentProfile,
  uploadProfilePhoto,
  updateUserProfile,
  changePassword
} = require('../controllers/user.controller');

router.post('/createUser', createUser);
router.get('/getUsers', getAllUsers);
router.get('/getUserdetails/:id', userDetails);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);
router.get('/profile', getCurrentProfile); // ✅ GET /api/user/profile
router.get('/profile/:id', userDetails); // Already defined
router.post('/profile/upload-photo/:id', upload.single('photo'), uploadProfilePhoto);
router.put('/profile/update/:id', updateUserProfile);
router.post('/change-password/:id', changePassword);


module.exports = router;
