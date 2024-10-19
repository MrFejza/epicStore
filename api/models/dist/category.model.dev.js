"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var categorySchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true
  },
  order: {
    type: Number,
    required: true // Ensure the order field is required

  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
}); // Middleware to generate the slug if it's not provided

categorySchema.pre('save', function (next) {
  if (!this.slug && this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }

  next();
});

var _default = _mongoose["default"].model('Category', categorySchema);

exports["default"] = _default;