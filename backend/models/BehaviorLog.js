const mongoose = require('mongoose');

const behaviorLogSchema = new mongoose.Schema(
  {
    userId: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'User',
      default: null  // null means guest user
    },
    productId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Product',
      required: true
    },
    action: {
      type:    String,
      enum:    ['view', 'cart', 'purchase'],
      default: 'view'
    },
    sessionId: {
      type:    String,
      default: ''  // for guest users — generated in frontend later
    },
    category: {
      type:    String,
      default: ''  // stored for faster aggregation queries
    }
  },
  { timestamps: true }
);

// indexes for fast aggregation queries
behaviorLogSchema.index({ userId:    1 });
behaviorLogSchema.index({ productId: 1 });
behaviorLogSchema.index({ action:    1 });
behaviorLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('BehaviorLog', behaviorLogSchema);