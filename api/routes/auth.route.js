import express from 'express';
import { signin, signup, checkAdmin, getUserProfile } from '../controllers/auth.controller.js';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/check-admin', checkAdmin, (req, res) => {
  res.json({ isAdmin: req.user.isAdmin });
});
router.get('/me', verifyToken, (req, res) => {
  getUserProfile(req, res);
});
router.post('/create', verifyToken, createOrder);
router.get('/', verifyToken, getOrders);
router.patch('/:id/status', verifyToken, updateOrderStatus);

export default router;