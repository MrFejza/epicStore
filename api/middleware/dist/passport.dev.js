"use strict";

var _passport = _interopRequireDefault(require("passport"));

var _passportFacebook = _interopRequireDefault(require("passport-facebook"));

var _passportGoogleOauth = _interopRequireDefault(require("passport-google-oauth20"));

var _userModel = _interopRequireDefault(require("../models/user.model.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config(); // Serialize the user into the session


_passport["default"].serializeUser(function (user, done) {
  done(null, user.id); // Only store the user ID in the session
}); // Deserialize the user from the session using the stored ID


_passport["default"].deserializeUser(function _callee(id, done) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findById(id));

        case 3:
          user = _context.sent;
          // Find the user by ID in the database
          done(null, user); // Return the user object

          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          done(_context.t0, null);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Facebook strategy


_passport["default"].use(new _passportFacebook["default"]({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: "/api/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name']
}, function _callee2(accessToken, refreshToken, profile, done) {
  var id, emails, name, user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          id = profile.id, emails = profile.emails, name = profile.name; // Check if a user with this Facebook ID exists

          _context2.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            facebookId: id
          }));

        case 4:
          user = _context2.sent;

          if (user) {
            _context2.next = 18;
            break;
          }

          _context2.next = 8;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: emails[0].value
          }));

        case 8:
          user = _context2.sent;

          if (!user) {
            _context2.next = 15;
            break;
          }

          // Link the Facebook account to the existing user
          user.facebookId = id;
          _context2.next = 13;
          return regeneratorRuntime.awrap(user.save());

        case 13:
          _context2.next = 18;
          break;

        case 15:
          _context2.next = 17;
          return regeneratorRuntime.awrap(_userModel["default"].create({
            username: name.givenName,
            email: emails[0].value,
            facebookId: id
          }));

        case 17:
          user = _context2.sent;

        case 18:
          return _context2.abrupt("return", done(null, user));

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](0);
          console.error('Error in Facebook strategy:', _context2.t0);
          return _context2.abrupt("return", done(_context2.t0, false));

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 21]]);
})); // Google strategy


_passport["default"].use(new _passportGoogleOauth["default"]({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, function _callee3(accessToken, refreshToken, profile, done) {
  var id, emails, displayName, user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = profile.id, emails = profile.emails, displayName = profile.displayName; // Check if a user with this Google ID exists

          _context3.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            googleId: id
          }));

        case 4:
          user = _context3.sent;

          if (user) {
            _context3.next = 18;
            break;
          }

          _context3.next = 8;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: emails[0].value
          }));

        case 8:
          user = _context3.sent;

          if (!user) {
            _context3.next = 15;
            break;
          }

          // Link the Google account to the existing user
          user.googleId = id;
          _context3.next = 13;
          return regeneratorRuntime.awrap(user.save());

        case 13:
          _context3.next = 18;
          break;

        case 15:
          _context3.next = 17;
          return regeneratorRuntime.awrap(_userModel["default"].create({
            username: displayName,
            email: emails[0].value,
            googleId: id
          }));

        case 17:
          user = _context3.sent;

        case 18:
          return _context3.abrupt("return", done(null, user));

        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](0);
          console.error('Error in Google strategy:', _context3.t0);
          return _context3.abrupt("return", done(_context3.t0, false));

        case 25:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 21]]);
}));