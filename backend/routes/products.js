const express = require('express');
const router  = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} = require('../controllers/productController');

const { protect, admin } = require('../middleware/authMiddleware');
const { upload }         = require('../config/cloudinary');

// public routes
router.get('/',            getProducts);
router.get('/featured',    getFeaturedProducts);
router.get('/:id',         getProductById);

// admin only routes
router.post('/',   protect, admin, upload.array('images', 5), createProduct);
router.put('/:id', protect, admin, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;