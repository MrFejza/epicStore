const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.route.js');
const productRoutes = require('./routes/product.route.js');
const orderRoutes = require('./routes/order.route.js');
const whatsappRoutes = require('./routes/whatsapp.js');
const categoryRoutes = require('./routes/category.route.js');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const { errorHandler } = require('./utils/error.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/category', categoryRoutes);

app.use(errorHandler);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
