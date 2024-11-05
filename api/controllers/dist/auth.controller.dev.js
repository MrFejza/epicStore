"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUserProfile = exports.updateUserKasa = exports.getUserProfile = exports.checkAdmin = exports.signin = exports.signup = void 0;

var _userModel = _interopRequireDefault(require("../models/user.model.js"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _error = require("../utils/error.js");

var _asyncHandler = _interopRequireDefault(require("../middleware/asyncHandler.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Function to handle user signup
var signup = function signup(req, res, next) {
  var _req$body, username, email, password, firstName, lastName, qyteti, rruga, hashedPassword, newUser, token;

  return regeneratorRuntime.async(function signup$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password, firstName = _req$body.firstName, lastName = _req$body.lastName, qyteti = _req$body.qyteti, rruga = _req$body.rruga;
          console.log('Request Body:', req.body); // Log the request body
          // Validate required fields

          if (!(!username || !email || !password)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'Missing required fields'
          }));

        case 4:
          _context.prev = 4;
          // Hash the password before storing it
          hashedPassword = _bcryptjs["default"].hashSync(password, 10); // Create a new user, setting isAdmin to false by default

          newUser = new _userModel["default"]({
            username: username,
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            isAdmin: false,
            // Set admin status to false by default
            homeAddress: qyteti && rruga ? {
              qyteti: qyteti,
              rruga: rruga
            } : undefined // Only set if both fields are provided

          }); // Save the new user in the database

          _context.next = 9;
          return regeneratorRuntime.awrap(newUser.save());

        case 9:
          // Generate a JWT token for the new user, just like in signin
          token = _jsonwebtoken["default"].sign({
            id: newUser._id
          }, process.env.JWT_SECRET, {
            expiresIn: '24h'
          } // Ensure this value is set to the intended duration
          ); // Return user ID and token so they can access protected routes

          res.status(201).json({
            success: true,
            message: 'User created successfully',
            userId: newUser._id,
            token: token
          });
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](4);
          console.error('Signup error:', _context.t0);
          next((0, _error.errorHandler)(500, 'Error creating user'));

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 13]]);
}; // Function to handle user signin


exports.signup = signup;

var signin = function signin(req, res, next) {
  var _req$body2, email, password, validUser, validPassword, token;

  return regeneratorRuntime.async(function signin$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: email
          }));

        case 4:
          validUser = _context2.sent;

          if (validUser) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", next((0, _error.errorHandler)(404, "User not found")));

        case 7:
          validPassword = _bcryptjs["default"].compareSync(password, validUser.password);

          if (validPassword) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", next((0, _error.errorHandler)(401, "Invalid credentials")));

        case 10:
          // Create JWT token with only user ID
          token = _jsonwebtoken["default"].sign({
            id: validUser._id
          }, process.env.JWT_SECRET, {
            expiresIn: '24h'
          }); // Return user ID, token, and isAdmin status

          res.status(200).json({
            userId: validUser._id,
            access_token: token,
            isAdmin: validUser.isAdmin,
            success: true
          });
          _context2.next = 18;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](1);
          console.error("Signin error:", _context2.t0);
          next((0, _error.errorHandler)(500, 'Error signing in'));

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 14]]);
}; // Function to check if the user is an admin


exports.signin = signin;

var checkAdmin = function checkAdmin(req, res, next) {
  var user;
  return regeneratorRuntime.async(function checkAdmin$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findById(req.user.id));

        case 3:
          user = _context3.sent;

          if (user) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 6:
          res.status(200).json({
            isAdmin: user.isAdmin
          });
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error("Error checking admin status:", _context3.t0);
          next((0, _error.errorHandler)(500, "Error checking admin status"));

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.checkAdmin = checkAdmin;
var getUserProfile = (0, _asyncHandler["default"])(function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (req.user) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt("return", res.status(401).json({
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
          return _context4.stop();
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
  var _req$body3, firstName, lastName, qyteti, rruga, phone, _req$body3$prefix, prefix, updateFields, updatedUser;

  return regeneratorRuntime.async(function updateUserKasa$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body3 = req.body, firstName = _req$body3.firstName, lastName = _req$body3.lastName, qyteti = _req$body3.qyteti, rruga = _req$body3.rruga, phone = _req$body3.phone, _req$body3$prefix = _req$body3.prefix, prefix = _req$body3$prefix === void 0 ? 'AL' : _req$body3$prefix;
          updateFields = {};
          if (firstName) updateFields.firstName = firstName;
          if (lastName) updateFields.lastName = lastName;
          if (phone) updateFields.phone = formatPhoneWithPrefix(phone, prefix); // Ensure nested fields in `homeAddress` are updated correctly

          if (qyteti || rruga) {
            updateFields.homeAddress = {};
            if (qyteti) updateFields.homeAddress.qyteti = qyteti;
            if (rruga) updateFields.homeAddress.rruga = rruga;
          }

          console.log("User ID:", req.user.id); // Log user ID

          console.log("Request Body:", req.body); // Log request body

          console.log("Update Fields:", updateFields); // Log update fields

          _context5.prev = 9;
          _context5.next = 12;
          return regeneratorRuntime.awrap(_userModel["default"].findByIdAndUpdate(req.user.id, {
            $set: updateFields
          }, {
            "new": true,
            runValidators: true
          }).select('-password'));

        case 12:
          updatedUser = _context5.sent;

          if (updatedUser) {
            _context5.next = 15;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 15:
          res.status(200).json({
            success: true,
            message: 'Profile updated successfully from Kasa',
            user: updatedUser
          });
          _context5.next = 22;
          break;

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](9);
          console.error('Error updating Kasa profile:', _context5.t0.message, _context5.t0.stack);
          next((0, _error.errorHandler)(500, 'Error updating Kasa profile'));

        case 22:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[9, 18]]);
}; // Account Controller


exports.updateUserKasa = updateUserKasa;

var updateUserProfile = function updateUserProfile(req, res, next) {
  var _req$body4, firstName, lastName, qyteti, rruga, phone, prefix, updateFields, formattedPhone, phoneRegex, updatedUser;

  return regeneratorRuntime.async(function updateUserProfile$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log("User ID:", req.body);
          _req$body4 = req.body, firstName = _req$body4.firstName, lastName = _req$body4.lastName, qyteti = _req$body4.qyteti, rruga = _req$body4.rruga, phone = _req$body4.phone, prefix = _req$body4.prefix;
          updateFields = {}; // Only add fields to updateFields if they are provided in the request

          if (firstName !== undefined) updateFields.firstName = firstName;
          if (lastName !== undefined) updateFields.lastName = lastName; // Process and validate phone if provided

          if (!(phone !== undefined)) {
            _context6.next = 11;
            break;
          }

          formattedPhone = formatPhoneWithPrefix(phone, prefix || 'AL');
          phoneRegex = /^(\+355\d{9}|\+383\d{8})$/;

          if (phoneRegex.test(formattedPhone)) {
            _context6.next = 10;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            message: "Invalid phone number format"
          }));

        case 10:
          updateFields.phone = formattedPhone;

        case 11:
          // Update homeAddress fields if provided
          if (qyteti !== undefined) updateFields['homeAddress.qyteti'] = qyteti;
          if (rruga !== undefined) updateFields['homeAddress.rruga'] = rruga; // Log user ID

          _context6.prev = 13;
          _context6.next = 16;
          return regeneratorRuntime.awrap(_userModel["default"].findByIdAndUpdate(req.user.id, {
            $set: updateFields
          }, {
            "new": true,
            runValidators: true
          }).select('-password'));

        case 16:
          updatedUser = _context6.sent;

          if (updatedUser) {
            _context6.next = 19;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 19:
          res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
          });
          _context6.next = 26;
          break;

        case 22:
          _context6.prev = 22;
          _context6.t0 = _context6["catch"](13);
          console.error('Error updating profile:', _context6.t0);
          next((0, _error.errorHandler)(500, 'Error updating profile'));

        case 26:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[13, 22]]);
};

exports.updateUserProfile = updateUserProfile;