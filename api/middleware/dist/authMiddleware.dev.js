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
var protect = (0, _asyncHandler["default"])(function _callee(req, res, next) {
  var token, decoded;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = req.cookies.jwt || req.headers.authorization && req.headers.authorization.split(" ")[1];

          if (token) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: 'Not authorized, no token'
          }));

        case 3:
          _context.prev = 3;
          decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
          _context.next = 7;
          return regeneratorRuntime.awrap(_userModel["default"].findById(decoded.id).select('-password'));

        case 7:
          req.user = _context.sent;

          if (req.user) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: 'Not authorized, user not found'
          }));

        case 10:
          next();
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](3);
          console.error('Token verification failed:', _context.t0);
          res.status(401).json({
            message: 'Not authorized, token failed'
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 13]]);
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