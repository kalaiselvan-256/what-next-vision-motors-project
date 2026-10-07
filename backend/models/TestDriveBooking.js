const mongoose = require('mongoose');

const testDriveBookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Please select a vehicle to test drive'],
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    preferredDate: {
      type: String,
      required: [true, 'Preferred date is required'],
    },
    preferredTime: {
      type: String,
      required: [true, 'Preferred time slot is required'],
    },
    dealershipLocation: {
      type: String,
      required: [true, 'Dealership / Innovation Center location is required'],
      default: 'WhatNext Silicon Valley Experience Center',
    },
    driverLicenseNumber: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Auto generate unique booking reference before saving
testDriveBookingSchema.pre('save', function () {
  if (!this.bookingReference) {
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.bookingReference = `WNV-TD-${Date.now().toString().slice(-4)}-${randomPart}`;
  }
});

module.exports = mongoose.model('TestDriveBooking', testDriveBookingSchema);
