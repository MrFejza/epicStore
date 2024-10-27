"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAdmin = exports.signin = exports.signup = void 0;

var _userModel = _interopRequireDefault(require("../models/user.model.js"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _error = require("../utils/error.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// Function to handle user signup
var signup = function signup(req, res, next) {
  var _req$body, username, email, password, firstName, lastName, qyteti, rruga, isAdmin, hashedPassword, newUser;

  return regeneratorRuntime.async(function signup$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password, firstName = _req$body.firstName, lastName = _req$body.lastName, qyteti = _req$body.qyteti, rruga = _req$body.rruga, isAdmin = _req$body.isAdmin;
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
          hashedPassword = _bcryptjs["default"].hashSync(password, 10); // Create a new user with the provided details

          newUser = new _userModel["default"]({
            username: username,
            email: email,
            password: hashedPassword,
            firstName: firstName,
            // Optional fields
            lastName: lastName,
            qyteti: qyteti,
            rruga: rruga,
            isAdmin: isAdmin
          }); // Save the new user in the database

          _context.next = 9;
          return regeneratorRuntime.awrap(newUser.save());

        case 9:
          res.status(201).json({
            success: true,
            message: 'User created successfully'
          });
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](4);
          console.error('Signup error:', _context.t0);
          next((0, _error.errorHandler)(500, 'Error creating user'));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 12]]);
}; // Function to handle user signin


exports.signup = signup;

var signin = function signin(req, res, next) {
  var _req$body2, email, password, validUser, validPassword, token, _validUser$_doc, pass, userWithoutPassword;

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
          token = _jsonwebtoken["default"].sign({
            id: validUser._id,
            isAdmin: validUser.isAdmin
          }, process.env.JWT_SECRET, {
            expiresIn: '1h'
          });
          _validUser$_doc = validUser._doc, pass = _validUser$_doc.password, userWithoutPassword = _objectWithoutProperties(_validUser$_doc, ["password"]);
          res.status(200).json(_objectSpread({
            access_token: token,
            success: true
          }, userWithoutPassword));
          _context2.next = 19;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](1);
          console.error("Signin error:", _context2.t0);
          next((0, _error.errorHandler)(500, 'Error signing in'));

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 15]]);
}; // Function to check if the user is an admin


exports.signin = signin;

var checkAdmin = function checkAdmin(req, res, next) {
  var email, user;
  return regeneratorRuntime.async(function checkAdmin$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          email = req.body.email;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: email
          }));

        case 4:
          user = _context3.sent;

          if (!user) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.json({
            isAdmin: user.isAdmin
          }));

        case 9:
          return _context3.abrupt("return", res.json({
            isAdmin: false
          }));

        case 10:
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](1);
          console.error('Error checking admin status:', _context3.t0);
          next((0, _error.errorHandler)(500, 'Error checking admin status'));

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 12]]);
};

exports.checkAdmin = checkAdmin;