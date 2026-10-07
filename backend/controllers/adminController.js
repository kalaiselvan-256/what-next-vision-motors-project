const Vehicle = require('../models/Vehicle');
const TestDriveBooking = require('../models/TestDriveBooking');
const ContactMessage = require('../models/ContactMessage');
const User = require('../models/User');

// @desc    Get Admin Dashboard Stats & Metrics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalVehicles,
      totalUsers,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalInquiries,
      newInquiries,
      recentBookings,
      recentInquiries,
      vehicleTypesAggregation,
    ] = await Promise.all([
      Vehicle.countDocuments(),
      User.countDocuments(),
      TestDriveBooking.countDocuments(),
      TestDriveBooking.countDocuments({ status: 'Pending' }),
      TestDriveBooking.countDocuments({ status: 'Confirmed' }),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: 'New' }),
      TestDriveBooking.find()
        .populate('vehicle', 'name model vehicleType images price')
        .sort({ createdAt: -1 })
        .limit(5),
      ContactMessage.find().sort({ createdAt: -1 }).limit(5),
      Vehicle.aggregate([
        {
          $group: {
            _id: '$vehicleType',
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalVehicles,
        totalUsers,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalInquiries,
        newInquiries,
        vehicleTypes: vehicleTypesAggregation,
        recentBookings,
        recentInquiries,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    let query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be user or admin.',
      });
    }

    // Prevent demoting own admin account
    if (req.user._id.toString() === req.params.id && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot revoke your own administrator privileges.',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account while logged in.',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
