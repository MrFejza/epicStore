import express from 'express';
import { createOrder, getOrders, getUserOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/orders
router.post('/', protect, createOrder );

// GET /api/orders - Fetch all orders
router.get('/', getOrders);
router.get('/user', protect, getUserOrders);


router.put('/:id', updateOrderStatus);

export default router;
