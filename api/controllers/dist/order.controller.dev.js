"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserOrders = exports.updateOrderStatus = exports.getOrders = exports.createOrder = void 0;

var _orderModel = _interopRequireDefault(require("../models/order.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Controller to create an order
var createOrder = function createOrder(req, res) {
  var _req$body, customerName, customerLastName, qyteti, rruga, phone, email, products, totalAmount, newOrder, savedOrder;

  return regeneratorRuntime.async(function createOrder$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("User ID from request:", req.user ? req.user.id : "No user ID"); // Log the incoming request body to verify the received data

          _req$body = req.body, customerName = _req$body.customerName, customerLastName = _req$body.customerLastName, qyteti = _req$body.qyteti, rruga = _req$body.rruga, phone = _req$body.phone, email = _req$body.email, products = _req$body.products, totalAmount = _req$body.totalAmount;
          console.log("Request body:", req.body); // Ensure all required fields are provided

          if (!(!customerName || !customerLastName || !qyteti || !rruga || !phone || !products || !totalAmount)) {
            _context.next = 6;
            break;
          }

          console.error("Missing required fields:", {
            customerName: customerName,
            customerLastName: customerLastName,
            qyteti: qyteti,
            rruga: rruga,
            phone: phone,
            products: products,
            totalAmount: totalAmount
          });
          return _context.abrupt("return", res.status(400).json({
            message: 'Please provide all required fields'
          }));

        case 6:
          _context.prev = 6;
          // Log each product to verify structure and content
          products.forEach(function (product, index) {
            return console.log("Product ".concat(index + 1, ":"), product);
          }); // Create an order, adding userId if the user is logged in

          newOrder = new _orderModel["default"]({
            customerName: customerName,
            customerLastName: customerLastName,
            qyteti: qyteti,
            rruga: rruga,
            phone: phone,
            email: email,
            products: products,
            totalAmount: totalAmount,
            userId: req.user ? req.user.id : null // Include userId if logged in

          }); // Save the new order in the database

          _context.next = 11;
          return regeneratorRuntime.awrap(newOrder.save());

        case 11:
          savedOrder = _context.sent;
          console.log("Order successfully created:", savedOrder);
          res.status(201).json(savedOrder);
          _context.next = 21;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](6);
          console.error("Error creating order:", _context.t0.message);
          console.error("Full error details:", _context.t0);
          res.status(500).json({
            message: 'Error creating order',
            error: _context.t0.message
          });

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 16]]);
}; // Controller to get orders - separate for user and admin


exports.createOrder = createOrder;

var getOrders = function getOrders(req, res) {
  var orders;
  return regeneratorRuntime.async(function getOrders$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_orderModel["default"].find());

        case 3:
          orders = _context2.sent;
          res.status(200).json(orders);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: 'Error fetching orders',
            error: _context2.t0
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Controller to update order status - Admin only


exports.getOrders = getOrders;

var updateOrderStatus = function updateOrderStatus(req, res) {
  var status, validStatuses, order;
  return regeneratorRuntime.async(function updateOrderStatus$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          status = req.body.status;
          validStatuses = ['Pending', 'Delivered'];
          _context3.prev = 2;

          if (validStatuses.includes(status)) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "Invalid status. Valid statuses are: ".concat(validStatuses.join(', '))
          }));

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(_orderModel["default"].findByIdAndUpdate(req.params.id, {
            status: status
          }, {
            "new": true
          }));

        case 7:
          order = _context3.sent;

          if (order) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Order not found'
          }));

        case 10:
          res.status(200).json({
            message: "Order status updated to ".concat(status),
            order: order
          });
          _context3.next = 16;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](2);
          res.status(500).json({
            message: 'Error updating order status',
            error: _context3.t0
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 13]]);
};

exports.updateOrderStatus = updateOrderStatus;

var getUserOrders = function getUserOrders(req, res) {
  var userOrders;
  return regeneratorRuntime.async(function getUserOrders$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_orderModel["default"].find({
            userId: req.user.id
          }).sort({
            createdAt: -1
          }));

        case 3:
          userOrders = _context4.sent;
          // Sorted by most recent
          res.status(200).json(userOrders);
          _context4.next = 11;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error('Error fetching user orders:', _context4.t0);
          res.status(500).json({
            message: 'Error fetching user orders',
            error: _context4.t0
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getUserOrders = getUserOrders;