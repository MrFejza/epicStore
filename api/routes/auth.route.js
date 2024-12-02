const express = require('express');
const { signin, signup, checkAdmin, getUserProfile, updateUserProfile, updateUserKasa } = require('../controllers/auth.controller.js');
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/order.controller.js');
const { protect, verifyToken } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/signin', signin);

// Protected routes
router.get('/check-admin', protect, checkAdmin);

// Use 'protect' for full user data in getUserProfile and updateUserProfile
router.get('/me', protect, getUserProfile);
router.put('/update-profile', protect, updateUserProfile);
router.put('/update-kasa', protect, updateUserKasa);

// Use verifyToken if only token validation is needed, e.g., for order creation
router.post('/create', verifyToken, createOrder);
router.get('/', protect, getOrders); // Using protect since getOrders may need user data
router.patch('/:id/status', protect, updateOrderStatus); // Using protect for user-specific status updates

module.exports = router;
