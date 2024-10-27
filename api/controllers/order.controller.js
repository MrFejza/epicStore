import Order from '../models/order.model.js';

// Controller to create an order
export const createOrder = async (req, res) => {
  const { customerName, customerLastName, qyteti, rruga, phone, email, products, totalAmount } = req.body;

  // Ensure all required fields are provided
  if (!customerName || !customerLastName || !qyteti || !rruga || !phone || !products || !totalAmount) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Create an order, adding userId if the user is logged in
    const newOrder = new Order({
      customerName,
      customerLastName,
      qyteti,
      rruga,
      phone,
      email,
      products,
      totalAmount,
      userId: req.user ? req.user.id : null, // Include userId if logged in
    });

    // Save the new order in the database
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

// Controller to get orders - separate for user and admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};



// Controller to update order status - Admin only
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending','Delivered'];

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
