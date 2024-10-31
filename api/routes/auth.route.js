import express from 'express';
import { signin, signup, checkAdmin, getUserProfile, updateUserProfile, updateUserKasa } from '../controllers/auth.controller.js';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { protect, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/signin', signin);

// Protected routes
router.post('/check-admin', protect, (req, res) => {
  res.json({ isAdmin: req.user.isAdmin });
});

// Use 'protect' for full user data in getUserProfile and updateUserProfile
router.get('/me', protect, getUserProfile);
router.put('/update-profile', protect, updateUserProfile);
router.put('/update-kasa', protect, updateUserKasa);

// Use verifyToken if only token validation is needed, e.g., for order creation
router.post('/create', verifyToken, createOrder);
router.get('/', protect, getOrders); // Using protect since getOrders may need user data
router.patch('/:id/status', protect, updateOrderStatus); // Using protect for user-specific status updates

export default router;