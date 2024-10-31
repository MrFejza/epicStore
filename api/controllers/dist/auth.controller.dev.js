"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUserProfile = exports.updateUserKasa = exports.getUserProfile = void 0;
var getUserProfile = asyncHandler(function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.user) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: 'User not found'
          }));

        case 2:
          res.status(200).json({
            userId: req.user._id,
            username: req.user.username,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            phone: req.user.phone,
            homeAddress: req.user.homeAddress || null,
            isAdmin: req.user.isAdmin
          });

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}); // Common function to handle phone formatting with prefix

exports.getUserProfile = getUserProfile;

var formatPhoneWithPrefix = function formatPhoneWithPrefix(phone, prefix) {
  var phonePrefix = prefix === 'KOS' ? '+383' : '+355';
  return phone.startsWith('+') ? phone : phonePrefix + phone;
}; // Kasa Controller


var updateUserKasa = function updateUserKasa(req, res, next) {
  var _req$body, firstName, lastName, qyteti, rruga, phone, _req$body$prefix, prefix, updateFields, updatedUser;

  return regeneratorRuntime.async(function updateUserKasa$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, firstName = _req$body.firstName, lastName = _req$body.lastName, qyteti = _req$body.qyteti, rruga = _req$body.rruga, phone = _req$body.phone, _req$body$prefix = _req$body.prefix, prefix = _req$body$prefix === void 0 ? 'AL' : _req$body$prefix;
          updateFields = {};
          if (firstName) updateFields.firstName = firstName;
          if (lastName) updateFields.lastName = lastName;
          if (phone) updateFields.phone = formatPhoneWithPrefix(phone, prefix);
          if (qyteti) updateFields['homeAddress.qyteti'] = qyteti;
          if (rruga) updateFields['homeAddress.rruga'] = rruga;
          console.log("User ID:", req.user.id); // Log user ID

          console.log("Request Body:", req.body); // Log request body

          console.log("Update Fields:", updateFields); // Log update fields

          _context2.prev = 10;
          _context2.next = 13;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            $set: updateFields
          }, {
            "new": true,
            runValidators: true
          }).select('-password'));

        case 13:
          updatedUser = _context2.sent;

          if (updatedUser) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 16:
          res.status(200).json({
            success: true,
            message: 'Profile updated successfully from Kasa',
            user: updatedUser
          });
          _context2.next = 23;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](10);
          console.error('Error updating Kasa profile:', _context2.t0.message, _context2.t0.stack);
          next(errorHandler(500, 'Error updating Kasa profile'));

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[10, 19]]);
}; // Account Controller


exports.updateUserKasa = updateUserKasa;

var updateUserProfile = function updateUserProfile(req, res, next) {
  var _req$body2, firstName, lastName, qyteti, rruga, phone, prefix, updateFields, formattedPhone, phoneRegex, updatedUser;

  return regeneratorRuntime.async(function updateUserProfile$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, firstName = _req$body2.firstName, lastName = _req$body2.lastName, qyteti = _req$body2.qyteti, rruga = _req$body2.rruga, phone = _req$body2.phone, prefix = _req$body2.prefix;
          updateFields = {}; // Only add fields to updateFields if they are provided in the request

          if (firstName !== undefined) updateFields.firstName = firstName;
          if (lastName !== undefined) updateFields.lastName = lastName; // Process and validate phone if provided

          if (!(phone !== undefined)) {
            _context3.next = 10;
            break;
          }

          formattedPhone = formatPhoneWithPrefix(phone, prefix || 'AL');
          phoneRegex = /^(\+355\d{9}|\+383\d{8})$/;

          if (phoneRegex.test(formattedPhone)) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "Invalid phone number format"
          }));

        case 9:
          updateFields.phone = formattedPhone;

        case 10:
          // Update homeAddress fields if provided
          if (qyteti !== undefined) updateFields['homeAddress.qyteti'] = qyteti;
          if (rruga !== undefined) updateFields['homeAddress.rruga'] = rruga;
          _context3.prev = 12;
          _context3.next = 15;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            $set: updateFields
          }, {
            "new": true,
            runValidators: true
          }).select('-password'));

        case 15:
          updatedUser = _context3.sent;

          if (updatedUser) {
            _context3.next = 18;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 18:
          res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
          });
          _context3.next = 25;
          break;

        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](12);
          console.error('Error updating profile:', _context3.t0);
          next(errorHandler(500, 'Error updating profile'));

        case 25:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[12, 21]]);
};

exports.updateUserProfile = updateUserProfile;