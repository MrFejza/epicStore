"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _passport = _interopRequireDefault(require("passport"));

var _passportGoogleOauth = require("passport-google-oauth20");

var _userModel = _interopRequireDefault(require("../models/user.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Import your User model
// Google Sign-Up Strategy
_passport["default"].use('google-signup', new _passportGoogleOauth.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google-signup/callback"
}, function _callee(accessToken, refreshToken, profile, done) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            googleId: profile.id
          }));

        case 3:
          user = _context.sent;

          if (!user) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", done(null, false, {
            message: 'User already exists, please sign in.'
          }));

        case 6:
          // Create a new user for sign-up
          user = new _userModel["default"]({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value // Use the primary email

          });
          _context.next = 9;
          return regeneratorRuntime.awrap(user.save());

        case 9:
          return _context.abrupt("return", done(null, user));

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", done(_context.t0, false));

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
})); // Google Sign-In Strategy


_passport["default"].use('google-signin', new _passportGoogleOauth.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google-signin/callback"
}, function _callee2(accessToken, refreshToken, profile, done) {
  var user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            googleId: profile.id
          }));

        case 3:
          user = _context2.sent;

          if (user) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", done(null, false));

        case 6:
          return _context2.abrupt("return", done(null, user));

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", done(_context2.t0, false));

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
})); // Serialize and Deserialize user


_passport["default"].serializeUser(function (user, done) {
  done(null, user.id);
});

_passport["default"].deserializeUser(function _callee3(id, done) {
  var user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findById(id));

        case 3:
          user = _context3.sent;
          done(null, user);
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          done(_context3.t0, null);

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
});

var _default = _passport["default"];
exports["default"] = _default;