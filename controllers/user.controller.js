const User = require('../models/user.model');
const nodemailer = require('nodemailer');
require('dotenv').config(); 
const bcrypt = require('bcryptjs');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 🔒 Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};



// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get user details by ID
exports.userDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePhoto: user.profilePhoto || null
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    user.resetCode = verificationCode;
    user.resetCodeExpires = expiry;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Grievance Cell App" <${process.env.EMAIL_USER}>`, // <-- Set your app name here
      to: user.email,
      subject: 'Your OTP Code',
      text: `Your verification code is: ${verificationCode}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Verification code sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending verification code', error });
  }
};

console.log('✅ POST /verify-code endpoint hit');

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'Email and code are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (
      user.resetCode !== code ||
      !user.resetCodeExpires ||
      user.resetCodeExpires < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully. You can now reset your password.' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Error verifying OTP', error });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    console.log("🔐 Reset Password Request:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found for reset");
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP was verified — these should be cleared after verification
    if (user.resetCode || (user.resetCodeExpires && user.resetCodeExpires > new Date())) {
      console.log("⚠️ OTP not verified or still active:", user.resetCode, user.resetCodeExpires);
      return res.status(400).json({ message: 'OTP not verified. Please verify OTP first.' });
    }

    const bcrypt = require('bcryptjs'); // Add this line if not already at top
    user.password = await bcrypt.hash(newPassword, 10); // ✅ hash the new password
    await user.save();

    console.log("✅ Password reset successful for", email);
    res.status(200).json({ message: 'Password has been reset successfully.' });

  } catch (error) {
    console.error('🔥 Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password', error });
  }
};

// ✅ Get Current Profile API
exports.getCurrentProfile = async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  try {
    const user = await User.findById(userId).select('-password -resetCode -resetCodeExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile', error });
  }
};
const path = require('path');
const fs = require('fs');

exports.uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete old profile photo if exists
    if (user.profilePhoto) {
      const oldPath = path.join(__dirname, '..', 'uploads', user.profilePhoto);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    user.profilePhoto = req.file.filename;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully',
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: 'Upload failed', error: err.message });
  }
};
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber } = req.body;

    if (!name && !email && !phoneNumber) {
      return res.status(400).json({ message: 'At least one field is required to update.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, phoneNumber },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    console.log('Input password:', oldPassword); // ✅ No more error
    console.log('New password:', newPassword);

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully.' });

  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};


