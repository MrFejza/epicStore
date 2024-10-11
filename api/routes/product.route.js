import express from 'express';
import Product from '../models/product.model.js'; // Import the Mongoose model
import upload from '../middleware/upload.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProductsByCategory } from '../controllers/product.controller.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Route to handle product creation with file upload
router.post('/', upload, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded.'
      });
    }

    const filePaths = req.files.map(file => `uploads/${file.filename}`);

    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: filePaths,
      stock: req.body.stock,
      category: req.body.category,
      popular: req.body.popular === 'true',  // Ensure it's a boolean
      onSale: req.body.onSale === 'true',  // Ensure it's a boolean
      salePrice: req.body.salePrice || 0  // Default salePrice if not provided
    });

    await newProduct.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// Route to get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
});

// Route to get products by category
router.get('/category/:category', getProductsByCategory);

// Route to get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error fetching product', error: error.message });
  }
});

// Route to update a specific product by ID
router.put('/:id', upload, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const images = req.files && req.files.length > 0 ? req.files.map(file => `uploads/${file.filename}`) : product.image;

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.image = images;
    product.stock = req.body.stock || product.stock;
    product.category = req.body.category || product.category;
    product.popular = req.body.popular !== undefined ? req.body.popular === 'true' : product.popular;
    product.onSale = req.body.onSale !== undefined ? req.body.onSale === 'true' : product.onSale;
    product.salePrice = req.body.salePrice || product.salePrice;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    console.error('Error updating product:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
  }
});

// Route to delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.image && Array.isArray(product.image)) {
      await deleteImages(product.image);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Product and images deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
