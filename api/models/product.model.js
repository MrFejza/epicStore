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
    type: String,
    required: true,
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
}, {  
  timestamps: true,
});


const Product = mongoose.model('Product', productSchema);
export default Product;