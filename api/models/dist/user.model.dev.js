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
    unique: false
  },
  email: {
    type: String,
    validate: {
      validator: function validator(v) {
        return !v || /\S+@\S+\.\S+/.test(v);
      },
      message: function message(props) {
        return "".concat(props.value, " is not a valid email address!");
      }
    }
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    "default": false
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  phone: {
    type: String,
    required: false,
    validate: {
      validator: function validator(v) {
        // Allow +355 with 9 digits or +383 with 8 digits
        return /^(\+355\d{9}|\+383\d{8})$/.test(v);
      },
      message: function message(props) {
        return "".concat(props.value, " is not a valid phone number!");
      }
    }
  },
  homeAddress: {
    qyteti: {
      type: String
    },
    rruga: {
      type: String
    }
  }
}, {
  timestamps: true
});

var User = _mongoose["default"].model("User", userSchema);

var _default = User;
exports["default"] = _default;