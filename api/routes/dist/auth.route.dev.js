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

var router = _express["default"].Router(); // Public routes


router.post('/signup', _authController.signup);
router.post('/signin', _authController.signin); // Protected routes

router.post('/check-admin', _authMiddleware.protect, function (req, res) {
  res.json({
    isAdmin: req.user.isAdmin
  });
}); // Use 'protect' for full user data in getUserProfile and updateUserProfile

router.get('/me', _authMiddleware.protect, _authController.getUserProfile);
router.put('/update-profile', _authMiddleware.protect, _authController.updateUserProfile);
router.put('/update-kasa', _authMiddleware.protect, _authController.updateUserKasa); // Use verifyToken if only token validation is needed, e.g., for order creation

router.post('/create', _authMiddleware.verifyToken, _orderController.createOrder);
router.get('/', _authMiddleware.protect, _orderController.getOrders); // Using protect since getOrders may need user data

router.patch('/:id/status', _authMiddleware.protect, _orderController.updateOrderStatus); // Using protect for user-specific status updates

var _default = router;
exports["default"] = _default;