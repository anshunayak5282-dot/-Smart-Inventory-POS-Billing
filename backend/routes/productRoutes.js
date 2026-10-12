const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

// GET /api/products - List products with optional search and category filters
router.get('/', (req, res) => {
  res.json({ message: 'Products retrieved successfully', count: 16 });
});

// POST /api/products - Create new product (Admin & Manager only)
router.post('/', verifyToken, authorizeRoles('admin', 'manager'), (req, res) => {
  const { name, sku, barcode, costPrice, sellingPrice, stock, minStockAlert, categoryId } = req.body;
  if (!name || !sku || !barcode || !sellingPrice) {
    return res.status(400).json({ error: 'Missing mandatory product fields' });
  }
  res.status(201).json({ message: 'Product created successfully', productId: Date.now() });
});

// PUT /api/products/:id - Update product
router.put('/:id', verifyToken, authorizeRoles('admin', 'manager'), (req, res) => {
  res.json({ message: `Product ${req.params.id} updated successfully` });
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: `Product ${req.params.id} removed from inventory` });
});

module.exports = router;
