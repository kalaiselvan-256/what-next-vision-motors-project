const TestDriveBooking = require('../models/TestDriveBooking');
const Vehicle = require('../models/Vehicle');

// @desc    Book a test drive
// @route   POST /api/bookings
// @access  Public (Optionally authenticated)
const createBooking = async (req, res, next) => {
  try {
    const {
      vehicleId,
      customerName,
      email,
      phone,
      preferredDate,
      preferredTime,
      dealershipLocation,
      notes,
    } = req.body;

    // Validate vehicle
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'The selected vehicle does not exist in our inventory.',
      });
    }

    if (!customerName || !email || !phone || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required booking details (Name, Email, Phone, Date, and Time).',
      });
    }

    // Associate logged in user if available
    const userId = req.user ? req.user._id : undefined;

    const booking = await TestDriveBooking.create({
      user: userId,
      vehicle: vehicleId,
      customerName,
      email: email.toLowerCase(),
      phone,
      preferredDate,
      preferredTime,
      dealershipLocation: dealershipLocation || 'WhatNext Silicon Valley Experience Center',
      notes: notes || '',
      status: 'Pending',
    });

    const populatedBooking = await TestDriveBooking.findById(booking._id).populate(
      'vehicle',
      'name model vehicleType price images badge'
    );

    res.status(201).json({
      success: true,
      message: 'Test drive scheduled successfully! Our mobility concierge will contact you shortly.',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings of the logged in user
// @route   GET /api/bookings/my-bookings
// @access  Private
const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await TestDriveBooking.find({
      $or: [{ user: req.user._id }, { email: req.user.email.toLowerCase() }],
    })
      .populate('vehicle', 'name model vehicleType price images fuelType badge')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { customerName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { bookingReference: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const total = await TestDriveBooking.countDocuments(query);
    const bookings = await TestDriveBooking.find(query)
      .populate('vehicle', 'name model vehicleType price images fuelType')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update test drive booking status (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Pending, Confirmed, Completed, or Cancelled.',
      });
    }

    const updateFields = { status };
    if (notes !== undefined) updateFields.notes = notes;

    const booking = await TestDriveBooking.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('vehicle', 'name model images');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found with the specified ID',
      });
    }

    res.json({
      success: true,
      message: `Booking status updated to "${status}"`,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking (Admin)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await TestDriveBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found with the specified ID',
      });
    }

    await booking.deleteOne();

    res.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
};
