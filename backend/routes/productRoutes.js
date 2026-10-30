const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

// Helper to normalize product format for client compatibility
const formatProduct = (doc) => {
  if (!doc) return null;
  const p = doc.toObject ? doc.toObject() : doc;
  const idStr = p._id ? p._id.toString() : (p.id || '');
  return {
    ...p,
    id: idStr,
    cost: p.costPrice !== undefined ? p.costPrice : p.cost,
    price: p.sellingPrice !== undefined ? p.sellingPrice : p.price,
    stock: p.currentStock !== undefined ? p.currentStock : p.stock,
    minStock: p.minStockAlert !== undefined ? p.minStockAlert : p.minStock,
    costPrice: p.costPrice !== undefined ? p.costPrice : p.cost,
    sellingPrice: p.sellingPrice !== undefined ? p.sellingPrice : p.price,
    currentStock: p.currentStock !== undefined ? p.currentStock : p.stock,
    minStockAlert: p.minStockAlert !== undefined ? p.minStockAlert : p.minStock
  };
};

// GET /api/products - List products with optional search and category filters
router.get('/', async (req, res) => {
  try {
    const { search, category, stockStatus } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    let products = await Product.find(query).sort({ createdAt: -1 });

    if (stockStatus === 'low') {
      products = products.filter(p => p.currentStock <= p.minStockAlert && p.currentStock > 0);
    } else if (stockStatus === 'out') {
      products = products.filter(p => p.currentStock <= 0);
    } else if (stockStatus === 'available') {
      products = products.filter(p => p.currentStock > p.minStockAlert);
    }

    res.json({ count: products.length, products: products.map(formatProduct) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    let product = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id);
    } else {
      product = await Product.findOne({ $or: [{ sku: req.params.id }, { barcode: req.params.id }] });
    }
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(formatProduct(product));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product', details: error.message });
  }
});

// POST /api/products - Create product (Admin & Manager)
router.post('/', verifyToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const name = req.body.name;
    const category = req.body.category || 'General';
    const sku = (req.body.sku || '').trim().toUpperCase();
    const barcode = (req.body.barcode || '').trim();
    const description = req.body.description || '';
    
    // Accept either cost/costPrice and price/sellingPrice
    const costPrice = req.body.costPrice !== undefined ? Number(req.body.costPrice) : (req.body.cost !== undefined ? Number(req.body.cost) : undefined);
    const sellingPrice = req.body.sellingPrice !== undefined ? Number(req.body.sellingPrice) : (req.body.price !== undefined ? Number(req.body.price) : undefined);
    const currentStock = req.body.currentStock !== undefined ? Number(req.body.currentStock) : (req.body.stock !== undefined ? Number(req.body.stock) : 0);
    const minStockAlert = req.body.minStockAlert !== undefined ? Number(req.body.minStockAlert) : (req.body.minStock !== undefined ? Number(req.body.minStock) : 10);
    const unit = req.body.unit || 'pcs';

    if (!name || !sku || !barcode || costPrice === undefined || sellingPrice === undefined) {
      return res.status(400).json({ error: 'Missing mandatory product fields (name, sku, barcode, cost/costPrice, price/sellingPrice)' });
    }

    const existing = await Product.findOne({ $or: [{ sku }, { barcode }] });
    if (existing) {
      return res.status(400).json({ error: 'A product with this SKU or Barcode already exists' });
    }

    const product = new Product({
      name,
      category,
      sku,
      barcode,
      description,
      costPrice,
      sellingPrice,
      currentStock,
      minStockAlert,
      unit
    });

    await product.save();

    // Log initial stock movement if stock > 0
    if (currentStock > 0) {
      await StockMovement.create({
        productId: product._id,
        productName: product.name,
        type: 'IN',
        qty: currentStock,
        prevQty: 0,
        newQty: currentStock,
        reason: 'Initial Inventory Setup',
        user: req.user?.role || 'admin'
      });
    }

    res.status(201).json({ message: 'Product created successfully', product: formatProduct(product) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
});

// PUT /api/products/:id - Update product (Admin & Manager)
router.put('/:id', verifyToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.cost !== undefined && updateData.costPrice === undefined) {
      updateData.costPrice = Number(updateData.cost);
    }
    if (updateData.price !== undefined && updateData.sellingPrice === undefined) {
      updateData.sellingPrice = Number(updateData.price);
    }
    if (updateData.stock !== undefined && updateData.currentStock === undefined) {
      updateData.currentStock = Number(updateData.stock);
    }
    if (updateData.minStock !== undefined && updateData.minStockAlert === undefined) {
      updateData.minStockAlert = Number(updateData.minStock);
    }

    let updatedProduct = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } else {
      updatedProduct = await Product.findOneAndUpdate(
        { $or: [{ sku: req.params.id }, { barcode: req.params.id }] },
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }

    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated successfully', product: formatProduct(updatedProduct) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

// DELETE /api/products/:id - Delete product (Admin & Manager)
router.delete('/:id', verifyToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    let deleted = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Product.findByIdAndDelete(req.params.id);
    } else {
      deleted = await Product.findOneAndDelete({ $or: [{ sku: req.params.id }, { barcode: req.params.id }] });
    }
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: `Product ${deleted.name} removed from inventory` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
});

// POST /api/products/stock-adjust - Inward / Outward adjustment
router.post('/stock-adjust', verifyToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { productId, type, qty, reason } = req.body;
    if (!productId || !type || !qty) {
      return res.status(400).json({ error: 'Missing productId, type, or qty' });
    }

    let product = null;
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(productId);
    } else {
      product = await Product.findOne({ $or: [{ sku: productId }, { barcode: productId }] });
    }

    if (!product) return res.status(404).json({ error: 'Product not found' });

    const prevQty = product.currentStock;
    let newQty = prevQty;

    if (type === 'IN') {
      newQty = prevQty + Number(qty);
    } else if (type === 'OUT') {
      newQty = Math.max(0, prevQty - Number(qty));
    }

    product.currentStock = newQty;
    await product.save();

    const movement = await StockMovement.create({
      productId: product._id,
      productName: product.name,
      type,
      qty: Number(qty),
      prevQty,
      newQty,
      reason: reason || (type === 'IN' ? 'Stock Inward' : 'Stock Outward / Damage'),
      user: req.user?.role || 'manager'
    });

    res.json({ message: 'Stock adjusted successfully', product: formatProduct(product), movement });
  } catch (error) {
    res.status(500).json({ error: 'Failed to adjust stock', details: error.message });
  }
});

module.exports = router;
