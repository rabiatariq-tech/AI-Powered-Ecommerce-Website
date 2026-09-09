const Product            = require('../models/Product');
const { cloudinary, uploadToCloudinary } = require('../config/cloudinary');

// ── @route   GET /api/products ───────────────────────
// ── @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      category, color, minPrice,
      maxPrice, sort, search, page, limit
    } = req.query;

    const query = {};

    if (category) query.category = category.toLowerCase();
    if (color)    query.color    = color.toLowerCase();
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags:        { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc')  sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating')     sortOption = { rating: -1 };
    if (sort === 'popular')    sortOption = { views: -1 };

    const pageNum  = Number(page)  || 1;
    const limitNum = Number(limit) || 12;
    const skip     = (pageNum - 1) * limitNum;

    const total    = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count:   products.length,
      total,
      pages:      Math.ceil(total / limitNum),
      currentPage: pageNum,
      products
    });
  } catch (error) {
    next(error);
  }
};

// ── @route   GET /api/products/featured ─────────────
// ── @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// ── @route   GET /api/products/:id ──────────────────
// ── @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // increment view count
    product.views += 1;
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// ── @route   POST /api/products ─────────────────────
// ── @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name, description, price,
      category, color, sizes,
      stock, tags, isFeatured
    } = req.body;

    // upload images to Cloudinary from memory buffer
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer)
      );
      images = await Promise.all(uploadPromises);
    }

    const product = await Product.create({
      name,
      description,
      price:      Number(price),
      category,
      color,
      sizes:      sizes  ? JSON.parse(sizes)  : [],
      stock:      Number(stock) || 0,
      tags:       tags   ? JSON.parse(tags)   : [],
      isFeatured: isFeatured === 'true',
      images
    });

    res.status(201).json({
      success: true,
      message: 'Product created',
      product
    });
  } catch (error) {
    next(error);
  }
};

// ── @route   PUT /api/products/:id ──────────────────
// ── @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // upload new images if provided
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer)
      );
      const newImages    = await Promise.all(uploadPromises);
      req.body.images    = [...product.images, ...newImages];
    }

    if (req.body.sizes) req.body.sizes = JSON.parse(req.body.sizes);
    if (req.body.tags)  req.body.tags  = JSON.parse(req.body.tags);
    if (req.body.price) req.body.price = Number(req.body.price);
    if (req.body.stock) req.body.stock = Number(req.body.stock);

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Product updated', product });
  } catch (error) {
    next(error);
  }
};

// ── @route   DELETE /api/products/:id ───────────────
// ── @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // delete images from Cloudinary
    for (const imageUrl of product.images) {
      const parts    = imageUrl.split('/');
      const filename = parts[parts.length - 1].split('.')[0];
      const publicId = `smart-commerce/products/${filename}`;
      await cloudinary.uploader.destroy(publicId);
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
};