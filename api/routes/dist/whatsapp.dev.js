"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _whatsappController = require("../controllers/whatsappController.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // POST route to send WhatsApp message when an order is placed


router.post('/', _whatsappController.sendWhatsAppMessage);
var _default = router;
exports["default"] = _default;