"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.protect = exports.verifyToken = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _asyncHandler = _interopRequireDefault(require("./asyncHandler.js"));

var _userModel = _interopRequireDefault(require("../models/user.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Ensure User model is imported
// Protect routes
var protect = (0, _asyncHandler["default"])(function _callee(request, response, next) {
  var token, decoded;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Read the JWT from the cookie
          token = request.cookies.jwt;

          if (!token) {
            _context.next = 17;
            break;
          }

          _context.prev = 2;
          decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET); // Use 'decoded.id' (not 'decoded.userId') to match what is stored in the token

          _context.next = 6;
          return regeneratorRuntime.awrap(_userModel["default"].findById(decoded.id).select('-password'));

        case 6:
          request.user = _context.sent;
          next();
          _context.next = 15;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](2);
          console.error(_context.t0);
          response.status(401);
          throw new Error('Not authorized, token failed');

        case 15:
          _context.next = 19;
          break;

        case 17:
          response.status(401);
          throw new Error('Not authorized, no token');

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 10]]);
});
exports.protect = protect;

var verifyToken = function verifyToken(req, res, next) {
  var authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    var token = authHeader.split(" ")[1];

    try {
      var decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET); // Attach decoded user data to req.user


      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } else {
    console.log('No token provided');
    res.status(403).json({
      success: false,
      message: 'No token provided'
    });
  }
};

exports.verifyToken = verifyToken;