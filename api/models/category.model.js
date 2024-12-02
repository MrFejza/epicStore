const mongoose = require('mongoose');

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
    required: true, 
    unique: true,
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

module.exports = mongoose.model('Category', categorySchema);
