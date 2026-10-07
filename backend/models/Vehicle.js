const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide vehicle name'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please provide vehicle model'],
      trim: true,
    },
    vehicleType: {
      type: String,
      required: [true, 'Please select vehicle type'],
      enum: ['Sedan', 'SUV', 'Hypercar', 'Coupe', 'Crossover', 'Concept', 'Luxury GT'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide vehicle price'],
      min: [0, 'Price must be positive'],
    },
    fuelType: {
      type: String,
      required: [true, 'Please select fuel type'],
      enum: ['EV', 'Hybrid', 'Petrol', 'Hydrogen', 'Plug-in Hybrid'],
    },
    rangeOrMileage: {
      type: String,
      required: [true, 'Please provide range or mileage specification'],
      trim: true,
    },
    transmission: {
      type: String,
      required: [true, 'Please specify transmission type'],
      enum: ['Single-Speed EV', 'Automatic', 'Dual-Clutch 8-Speed', 'E-CVT', 'Manual'],
      default: 'Single-Speed EV',
    },
    seatingCapacity: {
      type: Number,
      required: [true, 'Please specify seating capacity'],
      min: 1,
      max: 9,
      default: 5,
    },
    topSpeed: {
      type: String,
      default: '200 mph',
    },
    acceleration: {
      type: String,
      default: '0-60 mph in 2.8s',
    },
    horsepower: {
      type: String,
      default: '650 hp',
    },
    batteryCapacity: {
      type: String,
      default: '100 kWh',
    },
    releaseYear: {
      type: Number,
      default: 2026,
    },
    description: {
      type: String,
      required: [true, 'Please provide detailed vehicle description'],
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image URL'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A vehicle must have at least one image.',
      },
    },
    features: {
      type: [String],
      default: [],
    },
    specs: {
      motor: { type: String, default: 'Dual Motor Ultra-Torque AWD' },
      drivetrain: { type: String, default: 'All-Wheel Drive (AWD)' },
      chargingTime: { type: String, default: '10% to 80% in 18 minutes (350kW DC)' },
      dimensions: { type: String, default: '4,970mm L x 1,964mm W x 1,440mm H' },
      warranty: { type: String, default: '8-Year / 120,000-Mile Battery & Drivetrain' },
      cargoSpace: { type: String, default: '720 Litres' },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    inventoryCount: {
      type: Number,
      default: 5,
    },
    badge: {
      type: String,
      default: 'Flagship Edition',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual index for searching
vehicleSchema.index({ name: 'text', model: 'text', description: 'text', vehicleType: 'text' });

module.exports = mongoose.model('Vehicle', vehicleSchema);
