const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  name: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  }
}, { _id: false });

const saleSchema = new mongoose.Schema({
  invoiceNo: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: String,
    default: 'walkin'
  },
  customerName: {
    type: String,
    default: 'Walk-in Customer'
  },
  cashierName: {
    type: String,
    default: 'Cashier'
  },
  items: [saleItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  discountPercent: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  taxPercent: {
    type: Number,
    default: 18
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'credit'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'refunded'],
    default: 'paid'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sale', saleSchema);
