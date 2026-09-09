const BehaviorLog = require('../models/BehaviorLog');
const Product     = require('../models/Product');

// ── @route   POST /api/behavior/log ─────────────────
// ── @access  Public (works for both logged in and guest)
const logBehavior = async (req, res, next) => {
  try {
    const { productId, action, sessionId } = req.body;

    // productId is required
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'productId is required'
      });
    }

    // check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // create the log
    // userId comes from token if logged in (set by optional auth middleware)
    // null if guest
    const log = await BehaviorLog.create({
      userId:    req.user ? req.user._id : null,
      productId,
      action:    action    || 'view',
      sessionId: sessionId || '',
      category:  product.category  // save category for faster queries
    });

    res.status(201).json({
      success: true,
      message: 'Behavior logged',
      log
    });
  } catch (error) {
    next(error);
  }
};

// ── @route   GET /api/behavior/my ───────────────────
// ── @access  Private
// returns current user's recently viewed products
const getMyBehavior = async (req, res, next) => {
  try {
    const logs = await BehaviorLog.find({
      userId: req.user._id,
      action: 'view'
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('productId', 'name price images category rating');

    // remove duplicates — keep only latest view per product
    const seen       = new Set();
    const uniqueLogs = logs.filter(log => {
      const id = log.productId?._id?.toString();
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    res.json({
      success:  true,
      recentlyViewed: uniqueLogs.map(log => log.productId)
    });
  } catch (error) {
    next(error);
  }
};

// ── @route   GET /api/behavior/trending ─────────────
// ── @access  Public
// returns top 8 most viewed products in last 7 days
const getTrending = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const trending = await BehaviorLog.aggregate([
      {
        $match: {
          action:    'view',
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        // count views per product
        $group: {
          _id:   '$productId',
          views: { $sum: 1 }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 8 },
      {
        // join with products collection to get product details
        $lookup: {
          from:         'products',
          localField:   '_id',
          foreignField: '_id',
          as:           'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id:     '$product._id',
          name:    '$product.name',
          price:   '$product.price',
          images:  '$product.images',
          rating:  '$product.rating',
          category:'$product.category',
          views:   1
        }
      }
    ]);

    res.json({ success: true, trending });
  } catch (error) {
    next(error);
  }
};

// ── @route   GET /api/behavior/stats/:productId ─────
// ── @access  Private/Admin
// returns view, cart, purchase counts for one product
const getProductStats = async (req, res, next) => {
    try {
      const mongoose = require('mongoose');
      const ObjectId = mongoose.Types.ObjectId;
  
      const stats = await BehaviorLog.aggregate([
        {
          $match: {
            productId: new ObjectId(req.params.productId)
          }
        },
        {
          $group: {
            _id:   '$action',
            count: { $sum: 1 }
          }
        }
      ]);
  
      // format into a clean object
      const result = { view: 0, cart: 0, purchase: 0 };
      stats.forEach(s => { result[s._id] = s.count; });
  
      res.json({ success: true, stats: result });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  logBehavior,
  getMyBehavior,
  getTrending,
  getProductStats
};