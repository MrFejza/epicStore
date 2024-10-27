"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var orderSchema = new _mongoose["default"].Schema({
  userId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for guest orders

  },
  customerName: {
    type: String,
    required: true
  },
  customerLastName: {
    type: String,
    required: true
  },
  qyteti: {
    type: String,
    // City
    required: true
  },
  rruga: {
    type: String,
    // Street
    required: true
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function validator(v) {
        return /\d{10}/.test(v);
      },
      message: function message(props) {
        return "".concat(props.value, " is not a valid phone number!");
      }
    }
  },
  email: {
    type: String,
    validate: {
      validator: function validator(v) {
        return !v || /\S+@\S+\.\S+/.test(v);
      },
      message: function message(props) {
        return "".concat(props.value, " is not a valid email address!");
      }
    }
  },
  products: [{
    productId: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    "enum": ['Pending', 'Delivered'],
    "default": 'Pending'
  }
}, {
  timestamps: true
}); // Pre-save hook to calculate totalAmount

orderSchema.pre('save', function (next) {
  var order = this;
  order.totalAmount = order.products.reduce(function (acc, product) {
    return acc + product.quantity * product.price;
  }, 0);
  next();
});

var Order = _mongoose["default"].model('Order', orderSchema);

var _default = Order;
exports["default"] = _default;