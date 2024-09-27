// utils/error.js
export const errorHandler = (status, message) => {
  return (req, res, next) => {
    res.status(status).json({ success: false, message });
  };
};
