// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://SrimathiT:HiNK1HxqFQauPpEu@citygrievancecell.cjvl71v.mongodb.net/?retryWrites=true&w=majority&appName=CityGrievanceCell', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Stop the app on DB error
  }
};

module.exports = connectDB;
