"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateOrderStatus = exports.getOrders = exports.createOrder = void 0;

var _orderModel = _interopRequireDefault(require("../models/order.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Controller to create an order
var createOrder = function createOrder(req, res) {
  var _req$body, customerName, customerLastName, qyteti, rruga, phone, email, products, totalAmount, newOrder, savedOrder;

  return regeneratorRuntime.async(function createOrder$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, customerName = _req$body.customerName, customerLastName = _req$body.customerLastName, qyteti = _req$body.qyteti, rruga = _req$body.rruga, phone = _req$body.phone, email = _req$body.email, products = _req$body.products, totalAmount = _req$body.totalAmount; // Ensure all required fields are provided

          if (!(!customerName || !customerLastName || !qyteti || !rruga || !phone || !products || !totalAmount)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Please provide all required fields'
          }));

        case 3:
          _context.prev = 3;
          // Create an order, adding userId if the user is logged in
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

          _context.next = 7;
          return regeneratorRuntime.awrap(newOrder.save());

        case 7:
          savedOrder = _context.sent;
          res.status(201).json(savedOrder);
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](3);
          res.status(500).json({
            message: 'Error creating order',
            error: _context.t0
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 11]]);
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