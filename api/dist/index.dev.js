"use strict";

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _authRoute = _interopRequireDefault(require("./routes/auth.route.js"));

var _productRoute = _interopRequireDefault(require("./routes/product.route.js"));

var _orderRoute = _interopRequireDefault(require("./routes/order.route.js"));

var _whatsapp = _interopRequireDefault(require("./routes/whatsapp.js"));

var _categoryRoute = _interopRequireDefault(require("./routes/category.route.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _path = _interopRequireDefault(require("path"));

var _error = require("./utils/error.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var app = (0, _express["default"])();
var PORT = process.env.PORT || 9000;
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use((0, _cookieParser["default"])());

_mongoose["default"].connect(process.env.MONGO).then(function () {
  return console.log('Connected to MongoDB');
})["catch"](function (err) {
  return console.log(err);
});

app.use('/api/auth', _authRoute["default"]);
app.use('/api/product', _productRoute["default"]);
app.use('/api/orders', _orderRoute["default"]);
app.use('/api/whatsapp', _whatsapp["default"]);
app.use('/api/category', _categoryRoute["default"]);
app.get('/', function (req, res) {
  res.send('API is running...');
});
app.use(_error.errorHandler);
app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
});

var _dirname = _path["default"].resolve();

app.use('/uploads', _express["default"]["static"](_path["default"].join(_dirname, 'uploads')));
app.use(function (err, req, res, next) {
  var statusCode = err.statusCode || 500;
  var message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message
  });
});