const express = require('express');
const router = express.Router();
const {
  submitMessage,
  getAllMessages,
  updateMessageStatus,
  deleteMessage,
} = require('../controllers/contactController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public inquiry submission
router.post('/', submitMessage);

// Admin-only message views and actions
router.get('/', protect, authorizeRoles('admin'), getAllMessages);
router.put('/:id', protect, authorizeRoles('admin'), updateMessageStatus);
router.delete('/:id', protect, authorizeRoles('admin'), deleteMessage);

module.exports = router;
