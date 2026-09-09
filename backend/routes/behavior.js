const express = require('express');
const router  = express.Router();

const {
  logBehavior,
  getMyBehavior,
  getTrending,
  getProductStats
} = require('../controllers/behaviorController');

const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');

// public — works for guests and logged in users
router.post('/log',      optionalAuth, logBehavior);
router.get('/trending',  getTrending);

// private — logged in users only
router.get('/my',        protect, getMyBehavior);

// admin only
router.get('/stats/:productId', protect, admin, getProductStats);

module.exports = router;