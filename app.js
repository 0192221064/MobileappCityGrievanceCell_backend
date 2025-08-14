const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

app.use(cors());            // allow requests from your app (open for now)
app.use(express.json());    // parse JSON bodies

// connect to MongoDB Atlas using MONGO_URI in env vars
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ Mongo error', err));

// (optional) health check endpoint for Render
app.get('/health', (_, res) => res.status(200).send('ok'));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

const notificationRoutes = require('./routes/notification.routes');
app.use('/api/notifications', notificationRoutes);

const locationRoutes = require('./routes/location.routes');
app.use('/api/location', locationRoutes);

const grievanceRoutes = require('./routes/grievance.routes');
app.use('/api/issues', grievanceRoutes);

const paymentRoutes = require('./routes/payment.routes');
app.use('/api/payments', paymentRoutes);

const billRoutes = require('./routes/bill.routes');
app.use('/api/bill', billRoutes);

const authorityRoutes = require('./routes/authority.routes');
app.use('/api/authority', authorityRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));