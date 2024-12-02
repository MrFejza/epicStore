const Product = require('../models/product.model.js');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, stock, category, popular, onSale, salePrice, saleEndDate } = req.body;

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    if (!name || !price || !description || images.length === 0) {
      return res.status(400).json({ message: 'Missing required fields: name, price, description, and at least one image are mandatory' });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      image: images,
      stock: stock === 'true',
      category,
      popular: popular === 'true',
      onSale: onSale === 'true',
      salePrice: onSale === 'true' && salePrice ? salePrice : null,
      saleEndDate: onSale === 'true' && saleEndDate ? new Date(saleEndDate) : null,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error.message, error.stack);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Get all products, or filter by onSale, sort by createdAt, or randomize
exports.getProducts = async (req, res) => {
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
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const products = await Product.find({ category: new RegExp(`${category}$`, 'i') });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found in this category' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching products by category', error: error.message });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { existingImages, removedImages = [], onSale, salePrice, saleEndDate } = req.body;
    let newImages = [];

    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => `/uploads/${file.filename}`);
    }

    const updatedImages = existingImages ? existingImages.filter(img => !removedImages.includes(img)) : [];

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: [...updatedImages, ...newImages],
        stock: Boolean(req.body.stock),
        onSale: Boolean(onSale),
        salePrice: onSale === 'true' || onSale === true ? salePrice : null,
        saleEndDate: onSale === 'true' || onSale === true ? (saleEndDate ? new Date(saleEndDate) : null) : null,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error.message, error.stack);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message, error.stack);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
