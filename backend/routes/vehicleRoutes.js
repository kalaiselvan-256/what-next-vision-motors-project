const express = require('express');
const router = express.Router();
const {
  getAllVehicles,
  getFeaturedVehicles,
  getFilterOptions,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/featured', getFeaturedVehicles);
router.get('/filters', getFilterOptions);
router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);

// Admin-only endpoints
router.post('/', protect, authorizeRoles('admin'), createVehicle);
router.put('/:id', protect, authorizeRoles('admin'), updateVehicle);
router.delete('/:id', protect, authorizeRoles('admin'), deleteVehicle);

module.exports = router;
