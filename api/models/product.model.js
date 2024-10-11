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
    default: null,
    validate: {
      validator: function (value) {
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
    validate: {
      validator: function (value) {
        return value.length > 0;  // Ensure the array has at least one image
      },
      message: 'At least one image is required',
    },
    default: [],
  },
  stock: {
    type: Boolean,
    required: true,
    default: true,  // Default to in stock
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

// Pre-save hook to validate sale price before saving
productSchema.pre('save', function (next) {
  if (this.onSale && (this.salePrice === null || this.salePrice >= this.price)) {
    return next(new Error('Sale price must be set and lower than the original price when the product is on sale.'));
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
