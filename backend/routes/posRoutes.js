const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const StockMovement = require('../models/StockMovement');
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

// GET /api/pos/sales - Retrieve all past sales
router.get('/sales', verifyToken, async (req, res) => {
  try {
    const { search, paymentMethod } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { invoiceNo: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } }
      ];
    }

    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }

    const sales = await Sale.find(query).sort({ createdAt: -1 });
    res.json({ count: sales.length, sales });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales history', details: error.message });
  }
});

// GET /api/pos/sales/:id - Retrieve invoice details
router.get('/sales/:id', verifyToken, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Invoice not found' });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching invoice', details: error.message });
  }
});

// POST /api/pos/checkout - Finalize sale, deduct inventory, log movements & update customer
router.post('/checkout', verifyToken, authorizeRoles('admin', 'cashier'), async (req, res) => {
  try {
    const { items, customerId, customerName, discountPercent, taxPercent, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cart must contain at least one item' });
    }

    // 1. Calculate subtotals and verify stock
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.name || item.productId} not found in inventory` });
      }

      if (product.currentStock < item.qty) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.currentStock}, Requested: ${item.qty}`
        });
      }

      const itemTotal = product.sellingPrice * item.qty;
      subtotal += itemTotal;

      processedItems.push({
        productId: product._id,
        name: product.name,
        qty: item.qty,
        price: product.sellingPrice,
        cost: product.costPrice,
        total: itemTotal
      });
    }

    const discPct = Number(discountPercent) || 0;
    const discountAmount = (subtotal * discPct) / 100;
    const taxable = Math.max(0, subtotal - discountAmount);
    const taxPct = taxPercent !== undefined ? Number(taxPercent) : 18;
    const taxAmount = (taxable * taxPct) / 100;
    const grandTotal = taxable + taxAmount;

    // Generate unique invoice number
    const count = await Sale.countDocuments();
    const invoiceNo = `INV-2026-${String(count + 1001).padStart(5, '0')}`;

    // 2. Create Sale document
    const sale = new Sale({
      invoiceNo,
      customerId: customerId || 'walkin',
      customerName: customerName || 'Walk-in Customer',
      cashierName: req.user?.name || 'Cashier',
      items: processedItems,
      subtotal,
      discountPercent: discPct,
      discountAmount,
      taxPercent: taxPct,
      taxAmount,
      grandTotal,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: 'paid'
    });

    await sale.save();

    // 3. Deduct stock in real-time & record Stock Movements
    for (const item of processedItems) {
      const prod = await Product.findById(item.productId);
      if (prod) {
        const prevQty = prod.currentStock;
        prod.currentStock = Math.max(0, prevQty - item.qty);
        await prod.save();

        await StockMovement.create({
          productId: prod._id,
          productName: prod.name,
          type: 'OUT',
          qty: item.qty,
          prevQty,
          newQty: prod.currentStock,
          reason: `POS Sale: ${invoiceNo}`,
          user: req.user?.role || 'cashier'
        });
      }
    }

    // 4. Update Customer metrics if linked
    if (customerId && customerId !== 'walkin') {
      await Customer.findByIdAndUpdate(customerId, {
        $inc: { totalSpent: grandTotal, totalOrders: 1 }
      });
    }

    res.status(201).json({
      message: 'Sale finalized successfully and inventory updated',
      invoiceNo,
      sale
    });
  } catch (error) {
    res.status(500).json({ error: 'Checkout failed', details: error.message });
  }
});

module.exports = router;
