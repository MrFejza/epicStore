import mongoose from 'mongoose';

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
        return /\d{10}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  email: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /\S+@\S+\.\S+/.test(v);
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
  timestamps: true,
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
export default Order;
