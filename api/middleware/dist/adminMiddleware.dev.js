"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAdmin = void 0;

var checkAdmin = function checkAdmin(req, res, next) {
  var token, decoded, user;
  return regeneratorRuntime.async(function checkAdmin$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = req.cookies.access_token;

          if (token) {
            _context.next = 4;
            break;
          }

          console.log('No token provided');
          return _context.abrupt("return", res.status(403).json({
            success: false,
            message: 'No token provided'
          }));

        case 4:
          _context.prev = 4;
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log('Token decoded:', decoded);
          _context.next = 9;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 9:
          user = _context.sent;

          if (user) {
            _context.next = 13;
            break;
          }

          console.log('User not found');
          return _context.abrupt("return", res.status(403).json({
            success: false,
            message: 'Forbidden'
          }));

        case 13:
          if (user.isAdmin) {
            _context.next = 16;
            break;
          }

          console.log('User is not an admin');
          return _context.abrupt("return", res.status(403).json({
            success: false,
            message: 'Forbidden'
          }));

        case 16:
          req.user = user; // Add user to request object

          next();
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](4);
          console.error('Token verification error:', _context.t0); // Updated to error.log

          res.status(401).json({
            success: false,
            message: 'Invalid token'
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 20]]);
};

exports.checkAdmin = checkAdmin;