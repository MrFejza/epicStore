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
    required: true,
    validate: {
      validator: function validator(v) {
        return /\d{10}/.test(v);
      },
      message: function message(props) {
        return "".concat(props.value, " is not a valid phone number!");
      }
    }
  },
  homeAddress: {
    // Nested address object
    qyteti: {
      type: String // City

    },
    rruga: {
      type: String // Street

    }
  }
}, {
  timestamps: true
});

var User = _mongoose["default"].model("User", userSchema);

var _default = User;
exports["default"] = _default;