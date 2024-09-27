import Order from '../models/order.model.js';

export const createOrder = async (req, res) => {
  const { customerName, customerLastName, address, phone, email, products, totalAmount } = req.body;

  if (!customerName || !customerLastName || !address || !phone || !products || !totalAmount) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Create one order with multiple products
    const newOrder = new Order({
      customerName,
      customerLastName,
      address,
      phone,
      email,
      products, // Array of products
      totalAmount,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};


// Controller for getting all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};


export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};