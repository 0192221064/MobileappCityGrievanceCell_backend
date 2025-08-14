const mongoose = require('mongoose');
const Authority = require('./models/authority.model'); // Adjust path if needed
const connectDB = require('./config/db'); // Your DB connection logic

connectDB(); // Connect to MongoDB

const sampleAuthorities = [
  {
    name: 'Electricity Officer - Zone A',
    email: 'electricity.zonea@civicmail.com',
    phone: '9876543210',
    department: 'Electricity',
    location: 'Zone A',
  },
  {
    name: 'Garbage Supervisor - South Zone',
    email: 'garbage.south@civicmail.com',
    phone: '9823456789',
    department: 'Garbage',
    location: 'South Zone',
  },
  {
    name: 'Parking Admin - Central',
    email: 'parking.central@civicmail.com',
    phone: '9811122233',
    department: 'Parking',
    location: 'Central Zone',
  },
  {
    name: 'Roads Engineer - East',
    email: 'roads.east@civicmail.com',
    phone: '9855551212',
    department: 'Roads',
    location: 'East Zone',
  },
  {
    name: 'Water Department Officer - North',
    email: 'water.north@civicmail.com',
    phone: '9800000001',
    department: 'Water',
    location: 'North Zone',
  },
  {
    name: 'Drainage Incharge - West Zone',
    email: 'drainage.west@civicmail.com',
    phone: '9898989898',
    department: 'Drainage',
    location: 'West Zone',
  }
];

async function seed() {
  try {
    await Authority.deleteMany(); // optional: clear old data
    await Authority.insertMany(sampleAuthorities);
    console.log('✅ Authorities seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding authorities:', err.message);
  } finally {
    mongoose.disconnect();
  }
}

seed();
