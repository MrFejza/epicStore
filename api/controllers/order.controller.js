const Order = require('../models/order.model.js');

// Controller to create an order
exports.createOrder = async (req, res) => {
  console.log("User ID from request:", req.user ? req.user.id : "No user ID");

  const { customerName, customerLastName, qyteti, rruga, phone, email, products, totalAmount } = req.body;
  console.log("Request body:", req.body);

  if (!customerName || !customerLastName || !qyteti || !rruga || !phone || !products || !totalAmount) {
    console.error("Missing required fields:", { customerName, customerLastName, qyteti, rruga, phone, products, totalAmount });
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    products.forEach((product, index) => console.log(`Product ${index + 1}:`, product));

    const newOrder = new Order({
      customerName,
      customerLastName,
      qyteti,
      rruga,
      phone,
      email,
      products,
      totalAmount,
      userId: req.user ? req.user.id : null,
    });

    const savedOrder = await newOrder.save();
    console.log("Order successfully created:", savedOrder);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error.message);
    console.error("Full error details:", error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Controller to get orders - separate for user and admin
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Controller to update order status - Admin only
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Delivered'];

  try {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};

// Controller to get user-specific orders
exports.getUserOrders = async (req, res) => {
  try {
    const userOrders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error fetching user orders', error });
  }
};
