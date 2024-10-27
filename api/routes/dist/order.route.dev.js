"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _orderController = require("../controllers/order.controller.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // POST /api/orders


router.post('/', _orderController.createOrder); // GET /api/orders - Fetch all orders

router.get('/', _orderController.getOrders); // DELETE /api/orders/:id - Delete an order by ID

router.put('/:id', _orderController.updateOrderStatus);
var _default = router;
exports["default"] = _default;