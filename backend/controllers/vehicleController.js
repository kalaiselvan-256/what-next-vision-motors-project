const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles with live multi-criteria filtering & search
// @route   GET /api/vehicles
// @access  Public
const getAllVehicles = async (req, res, next) => {
  try {
    const {
      search,
      vehicleType,
      fuelType,
      minPrice,
      maxPrice,
      transmission,
      seatingCapacity,
      isAvailable,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    let query = {};

    // Keyword Search (Regex on name, model, description, vehicleType)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { model: searchRegex },
        { description: searchRegex },
        { vehicleType: searchRegex },
        { fuelType: searchRegex },
        { badge: searchRegex },
      ];
    }

    // Vehicle Type Filter (supports single or comma-separated list)
    if (vehicleType && vehicleType !== 'all') {
      const types = vehicleType.split(',').map((t) => t.trim());
      query.vehicleType = { $in: types };
    }

    // Fuel Type Filter
    if (fuelType && fuelType !== 'all') {
      const fuels = fuelType.split(',').map((f) => f.trim());
      query.fuelType = { $in: fuels };
    }

    // Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Transmission Filter
    if (transmission && transmission !== 'all') {
      query.transmission = transmission;
    }

    // Seating Capacity Filter
    if (seatingCapacity && seatingCapacity !== 'all') {
      query.seatingCapacity = Number(seatingCapacity);
    }

    // Availability Filter
    if (isAvailable !== undefined && isAvailable !== 'all') {
      query.isAvailable = isAvailable === 'true' || isAvailable === true;
    }

    // Sorting
    let sortQuery = { createdAt: -1 }; // default: newest
    if (sort === 'price_asc') sortQuery = { price: 1 };
    else if (sort === 'price_desc') sortQuery = { price: -1 };
    else if (sort === 'name_asc') sortQuery = { name: 1 };
    else if (sort === 'name_desc') sortQuery = { name: -1 };
    else if (sort === 'oldest') sortQuery = { createdAt: 1 };

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: vehicles.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      vehicles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured vehicles for Hero/Showcase
// @route   GET /api/vehicles/featured
// @access  Public
const getFeaturedVehicles = async (req, res, next) => {
  try {
    const featured = await Vehicle.find({ isFeatured: true }).limit(6);
    // If not enough marked featured, grab latest
    if (featured.length === 0) {
      const fallback = await Vehicle.find().limit(6);
      return res.json({ success: true, count: fallback.length, vehicles: fallback });
    }
    res.json({ success: true, count: featured.length, vehicles: featured });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct filter parameters
// @route   GET /api/vehicles/filters
// @access  Public
const getFilterOptions = async (req, res, next) => {
  try {
    const [types, fuels, priceStats] = await Promise.all([
      Vehicle.distinct('vehicleType'),
      Vehicle.distinct('fuelType'),
      Vehicle.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      types,
      fuels,
      priceRange: {
        min: priceStats[0]?.minPrice || 35000,
        max: priceStats[0]?.maxPrice || 350000,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found with the specified ID',
      });
    }

    res.json({
      success: true,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new vehicle
// @route   POST /api/vehicles
// @access  Private/Admin
const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Vehicle added to inventory successfully',
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle details
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
const updateVehicle = async (req, res, next) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found with the specified ID',
      });
    }

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found with the specified ID',
      });
    }

    await vehicle.deleteOne();

    res.json({
      success: true,
      message: 'Vehicle removed from inventory successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVehicles,
  getFeaturedVehicles,
  getFilterOptions,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
