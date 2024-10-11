import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  salePrice: {  
    type: Number,
    default: null,  // Only set this when the product is on sale
    validate: {
      validator: function(value) {
        return this.onSale ? value !== null && value < this.price : value === null;
      },
      message: 'Sale price must be less than the original price when the product is on sale.',
    },
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: [String],
    required: true,
    default: [],
  },
  stock: {
    type: Number,  // Can change this to Boolean or Number depending on your needs
    required: true,
    min: [0, 'Stock cannot be negative'],
  },
  category: {
    type: String,
    required: true,
  },
  popular: {
    type: Boolean,
    required: true,
    default: false,
  },
  onSale: {  
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,  
});

const Product = mongoose.model('Product', productSchema);
export default Product;
