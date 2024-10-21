"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var userSchema = new _mongoose["default"].Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    // Conditionally required: only required if the user does not have a social login
    required: function required() {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Ensures only non-null values are treated as unique

  },
  isAdmin: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields

});

var User = _mongoose["default"].model("User", userSchema);

var _default = User;
exports["default"] = _default;