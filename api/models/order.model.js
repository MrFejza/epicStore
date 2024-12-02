const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,  // Optional for guest orders
  },
  customerName: {
    type: String,
    required: true,
  },
  customerLastName: {
    type: String,
    required: true,
  },
  qyteti: {
    type: String,  // City
    required: true,
  },
  rruga: {
    type: String,  // Street
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v); // Ensure the phone number has 10 digits
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  email: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /\S+@\S+\.\S+/.test(v); // Allow empty or valid email addresses
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Delivered'],
    default: 'Pending',
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Pre-save hook to calculate totalAmount
orderSchema.pre('save', function (next) {
  const order = this;
  order.totalAmount = order.products.reduce((acc, product) => {
    return acc + product.quantity * product.price;
  }, 0);
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
