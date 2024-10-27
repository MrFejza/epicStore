"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendWhatsAppMessage = void 0;

var _twilio = _interopRequireDefault(require("twilio"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var client = (0, _twilio["default"])(accountSid, authToken); // Use the phone number from the .env file for the website owner 

var specificClientNumber = process.env.OWNER_PHONE_NUMBER || 'whatsapp:+355688697389';

var sendWhatsAppMessage = function sendWhatsAppMessage(req, res) {
  var _req$body, customerName, customerLastName, phone, email, qyteti, rruga, products, totalAmount, productDetails, message, response;

  return regeneratorRuntime.async(function sendWhatsAppMessage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, customerName = _req$body.customerName, customerLastName = _req$body.customerLastName, phone = _req$body.phone, email = _req$body.email, qyteti = _req$body.qyteti, rruga = _req$body.rruga, products = _req$body.products, totalAmount = _req$body.totalAmount;
          _context.prev = 1;

          if (!(!customerName || !customerLastName || !phone || !qyteti || !rruga || !products || !totalAmount)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'Missing required fields'
          }));

        case 4:
          // Format the product details
          productDetails = products.map(function (product) {
            return "".concat(product.quantity, "x ").concat(product.productName, " (").concat(product.price.toFixed(2), " Lek)");
          }).join(', '); // Format the message to be sent via WhatsApp

          message = "\n      New Order Placed:\n      - Customer: ".concat(customerName, " ").concat(customerLastName, "\n      - Phone: ").concat(phone, "\n      - Email: ").concat(email || 'N/A', "\n      - Qyteti: ").concat(qyteti, "\n      - Rruga: ").concat(rruga, "\n      - Total: ").concat(totalAmount.toFixed(2), " Lek\n      - Products: ").concat(productDetails, "\n    "); // Send the WhatsApp message using Twilio's API

          _context.next = 8;
          return regeneratorRuntime.awrap(client.messages.create({
            from: 'whatsapp:+14155238886',
            // Twilio sandbox number for WhatsApp
            to: specificClientNumber,
            // Send to the hardcoded owner's WhatsApp number
            body: message // Message body with order details

          }));

        case 8:
          response = _context.sent;
          return _context.abrupt("return", res.status(200).json({
            success: true,
            message: 'Message sent!',
            sid: response.sid
          }));

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](1);
          console.error('Error sending WhatsApp message:', _context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: 'Error sending message',
            error: _context.t0.message
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 12]]);
};

exports.sendWhatsAppMessage = sendWhatsAppMessage;