const express = require('express');
const { createOrder, getOrders, getUserOrders, updateOrderStatus } = require('../controllers/order.controller.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// POST /api/orders
router.post('/', protect, createOrder);

// GET /api/orders - Fetch all orders
router.get('/', getOrders);
router.get('/user', protect, getUserOrders);

router.put('/:id', updateOrderStatus);

module.exports = router;
