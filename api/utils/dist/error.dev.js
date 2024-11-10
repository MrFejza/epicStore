"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorHandler = exports.createError = void 0;

// Utility function to create a custom error object
var createError = function createError(status, message) {
  var error = new Error(message);
  error.status = status;
  return error;
}; // Centralized error-handling middleware


exports.createError = createError;

var errorHandler = function errorHandler(err, req, res, next) {
  var status = err.status || 500;
  var message = err.message || 'Internal Server Error';
  res.status(status).json({
    success: false,
    message: message
  });
};

exports.errorHandler = errorHandler;