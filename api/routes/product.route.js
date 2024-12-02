const express = require('express');
const Product = require('../models/product.model.js'); // Import the Mongoose model
const upload = require('../middleware/upload.js');
const fs = require('fs-extra');
const path = require('path');
const { getProductsByCategory } = require('../controllers/product.controller.js');

const router = express.Router();


// Helper function to delete images
const deleteImages = async (imagePaths) => {
  return Promise.all(imagePaths.map(imagePath => {
    const fullPath = path.join(__dirname, '..', imagePath);

    console.log(`Attempting to delete ${fullPath}`);

    if (fs.existsSync(fullPath)) {
      return fs.remove(fullPath)
        .then(() => console.log(`Deleted ${fullPath}`))
        .catch(err => console.error(`Error deleting ${fullPath}:`, err));
    } else {
      console.log(`File does not exist: ${fullPath}`);
      return Promise.resolve();
    }
  }));
};

// Error handler helper function
const handleServerError = (res, error, message) => {
  console.error(`${message}:`, error.message, error.stack);
  res.status(500).json({ success: false, message, error: error.message });
};

// Middleware to check if the product exists by ID
const checkProductExists = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    req.product = product;
    next();
  } catch (error) {
    handleServerError(res, error, 'Error checking product existence');
  }
};

// Route to handle product creation with file upload
router.post('/', upload, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded.'
      });
    }

    const { name, price, salePrice, description, stock, category, popular, onSale, saleEndDate } = req.body;
    const filePaths = req.files.map(file => `uploads/${file.filename}`);

    if (onSale === 'true' && parseFloat(salePrice) >= parseFloat(price)) {
      return res.status(400).json({
        success: false,
        message: 'Sale price must be less than the original price when the product is on sale.'
      });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      image: filePaths,
      stock: stock === 'true',
      category,
      popular: popular === 'true',
      onSale: onSale === 'true',
      salePrice: onSale === 'true' ? salePrice : null,
      saleEndDate: onSale === 'true' && saleEndDate ? new Date(saleEndDate) : null
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    handleServerError(res, error, 'Error creating product');
  }
});

// Route to get all products
router.get('/', async (req, res) => {
  try {
    const { onSale, sort, order, random } = req.query;

    let query = {};

    if (onSale === 'true') {
      query.onSale = true;
    }

    let productsQuery;

    if (random === 'true') {
      productsQuery = await Product.aggregate([{ $sample: { size: 10 } }]);
    } else {
      productsQuery = Product.find(query);

      if (sort === 'createdAt') {
        const sortOrder = order === 'asc' ? 1 : -1;
        productsQuery = productsQuery.sort({ createdAt: sortOrder });
      }
    }

    const products = await productsQuery;

    const now = new Date();
    products.forEach(async (product) => {
      if (product.onSale && product.saleEndDate && new Date(product.saleEndDate) <= now) {
        product.onSale = false;
        product.salePrice = null;
        product.saleEndDate = null;
        await product.save();
      }
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Route to get products by category
router.get('/category/:category', getProductsByCategory);

// Route to get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    console.log(product)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    handleServerError(res, error, 'Error fetching product');
  }
});

// Route to update a specific product by ID
router.put('/:id', upload, checkProductExists, async (req, res) => {
  try {
    const product = req.product;
    const { name, price, salePrice, description, stock, category, popular, onSale, saleEndDate } = req.body;

    const images = req.files && req.files.length > 0 ? req.files.map(file => `uploads/${file.filename}`) : product.image;

    if (req.files && req.files.length > 0 && product.image && Array.isArray(product.image)) {
      await deleteImages(product.image);
    }

    if (onSale === 'true' && parseFloat(salePrice) >= parseFloat(price)) {
      return res.status(400).json({
        success: false,
        message: 'Sale price must be less than the original price when the product is on sale.'
      });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = images;
    product.stock = stock === 'true' || stock === 'in_stock';
    product.category = category || product.category;
    product.popular = popular !== undefined ? popular === 'true' : product.popular;
    product.onSale = onSale !== undefined ? onSale === 'true' : product.onSale;
    product.salePrice = onSale === 'true' ? salePrice : null;
    product.saleEndDate = onSale === 'true' && saleEndDate ? new Date(saleEndDate) : null;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    handleServerError(res, error, 'Error updating product');
  }
});

// Route to delete a product by ID
router.delete('/:id', checkProductExists, async (req, res) => {
  try {
    const product = req.product;

    if (product.image && Array.isArray(product.image)) {
      await deleteImages(product.image);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Product and images deleted successfully' });
  } catch (error) {
    handleServerError(res, error, 'Error deleting product');
  }
});

module.exports = router;
