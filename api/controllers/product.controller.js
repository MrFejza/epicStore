import Product from '../models/product.model.js';

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock, category, popular, onSale, salePrice } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newProduct = new Product({
      name,
      price,
      description,
      image: images,
      stock,
      category,
      popular,
      onSale: Boolean(onSale),   // Ensure onSale defaults to false if not provided
      salePrice: onSale === 'true' || onSale === true ? salePrice : null  // Set salePrice only if onSale is true
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Get all products, or filter by onSale, sort by createdAt, or randomize
export const getProducts = async (req, res) => {
  try {
    const { onSale, sort, order, random } = req.query;

    let query = {};

    // Filter by onSale if specified
    if (onSale === 'true') {
      query.onSale = true;
    }

    let productsQuery;

    // Randomize products using MongoDB's $sample if random=true
    if (random === 'true') {
      productsQuery = await Product.aggregate([{ $sample: { size: 10 } }]); // Random 10 products
    } else {
      // Base query
      productsQuery = Product.find(query);

      // Sorting by createdAt
      if (sort === 'createdAt') {
        const sortOrder = order === 'asc' ? 1 : -1;
        productsQuery = productsQuery.sort({ createdAt: sortOrder });
      }
    }

    // Fetch products
    const products = await productsQuery;
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    // Case-insensitive category search
    const products = await Product.find({ category: new RegExp(`^${category}$`, 'i') });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found in this category' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Error fetching products by category' });
  }
};

// Get a product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    const { existingImages, removedImages, onSale, salePrice } = req.body;
    let newImages = [];

    // Handle new images
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Remove deleted images from the list of existing images
    const updatedImages = existingImages ? existingImages.filter(img => !removedImages.includes(img)) : [];

    // Update the product with new data
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: [...updatedImages, ...newImages], // Combine new and existing images
        onSale: Boolean(onSale),  // Ensure onSale is treated as a boolean
        salePrice: onSale === 'true' || onSale === true ? salePrice : null  // Set salePrice to null if onSale is false
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
