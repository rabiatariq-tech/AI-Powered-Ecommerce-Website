const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Please add a product name'],
      trim:     true
    },
    description: {
      type:     String,
      required: [true, 'Please add a description']
    },
    price: {
      type:     Number,
      required: [true, 'Please add a price'],
      min:      0
    },
    category: {
      type:     String,
      required: [true, 'Please add a category'],
      enum:     ['footwear', 'clothing', 'accessories', 'electronics', 'home', 'beauty', 'sports'],
      lowercase: true
    },
    color: {
      type:    String,
      default: '',
      lowercase: true
    },
    sizes: {
      type:    [String],
      default: []
    },
    images: {
      type:    [String], // array of Cloudinary URLs
      default: []
    },
    stock: {
      type:    Number,
      default: 0,
      min:     0
    },
    tags: {
      type:    [String],
      default: []
    },
    rating: {
      type:    Number,
      default: 0,
      min:     0,
      max:     5
    },
    numReviews: {
      type:    Number,
      default: 0
    },
    isFeatured: {
      type:    Boolean,
      default: false
    },
    views: {
      type:    Number,
      default: 0   // incremented by behavior tracking
    }
  },
  { timestamps: true }
);

// index for faster search queries
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);