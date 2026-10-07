const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./backend/config/db');
const { seedDatabase } = require('./backend/seeders/seedData');

// Route imports
const authRoutes = require('./backend/routes/authRoutes');
const vehicleRoutes = require('./backend/routes/vehicleRoutes');
const bookingRoutes = require('./backend/routes/bookingRoutes');
const contactRoutes = require('./backend/routes/contactRoutes');
const adminRoutes = require('./backend/routes/adminRoutes');
const { notFound, errorHandler } = require('./backend/middleware/errorMiddleware');

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, 'frontend')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'WhatNext Vision Motors API',
    tagline: 'Shaping the Future of Mobility with Innovation and Excellence',
    timestamp: new Date().toISOString(),
  });
});

// For any non-API GET route, serve frontend index.html fallback
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.url.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  }
  next();
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Database & Start Server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    const server = app.listen(PORT, () => {
      console.log('================================================================');
      console.log(`🚗 WhatNext Vision Motors Server is running on port ${PORT}`);
      console.log(`🌐 Web URL: http://localhost:${PORT}`);
      console.log(`📡 API URL: http://localhost:${PORT}/api/health`);
      console.log('================================================================');
    });

    process.on('unhandledRejection', (err) => {
      console.error(`Unhandled Error: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;
