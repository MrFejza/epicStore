"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authController = require("../controllers/auth.controller.js");

var _orderController = require("../controllers/order.controller.js");

var _authMiddleware = require("../middleware/authMiddleware.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.post('/signup', _authController.signup);
router.post('/signin', _authController.signin);
router.post('/check-admin', _authController.checkAdmin, function (req, res) {
  res.json({
    isAdmin: req.user.isAdmin
  });
});
router.get('/me', _authMiddleware.verifyToken, function (req, res) {
  (0, _authController.getUserProfile)(req, res);
});
router.post('/create', _authMiddleware.verifyToken, _orderController.createOrder);
router.get('/', _authMiddleware.verifyToken, _orderController.getOrders);
router.patch('/:id/status', _authMiddleware.verifyToken, _orderController.updateOrderStatus);
var _default = router;
exports["default"] = _default;