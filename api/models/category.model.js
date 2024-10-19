import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
  order: {
    type: Number,
    required: true, // Ensure the order field is required
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to generate the slug if it's not provided
categorySchema.pre('save', function (next) {
  if (!this.slug && this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

export default mongoose.model('Category', categorySchema);
