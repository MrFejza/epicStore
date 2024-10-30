"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _orderController = require("../controllers/order.controller.js");

var _authMiddleware = require("../middleware/authMiddleware.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // POST /api/orders


router.post('/', _authMiddleware.protect, _orderController.createOrder); // GET /api/orders - Fetch all orders

router.get('/', _orderController.getOrders);
router.get('/user', _authMiddleware.protect, _orderController.getUserOrders);
router.put('/:id', _orderController.updateOrderStatus);
var _default = router;
exports["default"] = _default;