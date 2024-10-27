import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/order.controller.js';

const router = express.Router();

// POST /api/orders
router.post('/', createOrder);

// GET /api/orders - Fetch all orders
router.get('/', getOrders);

// DELETE /api/orders/:id - Delete an order by ID
router.put('/:id', updateOrderStatus);

export default router;
