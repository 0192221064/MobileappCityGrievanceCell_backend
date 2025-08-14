// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json'); // ✅ this is your JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
