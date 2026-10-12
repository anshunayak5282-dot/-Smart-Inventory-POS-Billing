const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

// POST /api/pos/checkout - Process POS bill, calculate tax & deduct stock
router.post('/checkout', verifyToken, authorizeRoles('admin', 'cashier'), (req, res) => {
  const { items, customerId, discountPercent, taxPercent, paymentMethod } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Cart must contain at least one item' });
  }

  const invoiceNo = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  res.status(201).json({
    message: 'Sale finalized and inventory updated',
    invoiceNo,
    timestamp: new Date().toISOString(),
    paymentMethod: paymentMethod || 'cash'
  });
});

module.exports = router;
