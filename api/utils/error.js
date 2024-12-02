// Utility function to create a custom error object
const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

// Centralized error-handling middleware
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, message });
};

module.exports = {
  createError,
  errorHandler,
};
