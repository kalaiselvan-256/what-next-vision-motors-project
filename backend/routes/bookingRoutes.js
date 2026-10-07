const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');
const {
  protect,
  authorizeRoles,
  optionalAuth,
} = require('../middleware/authMiddleware');

// Public or logged-in user booking creation
router.post('/', optionalAuth, createBooking);

// User-specific bookings
router.get('/my-bookings', protect, getUserBookings);

// Admin-only booking management
router.get('/', protect, authorizeRoles('admin'), getAllBookings);
router.put('/:id/status', protect, authorizeRoles('admin'), updateBookingStatus);
router.delete('/:id', protect, authorizeRoles('admin'), deleteBooking);

module.exports = router;
