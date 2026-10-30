const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['IN', 'OUT', 'ADJUSTMENT'],
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  prevQty: {
    type: Number,
    required: true
  },
  newQty: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    default: ''
  },
  user: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StockMovement', stockMovementSchema);
