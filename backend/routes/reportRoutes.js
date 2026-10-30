const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const verifyToken = require('../middleware/auth');

// GET /api/reports/dashboard - Consolidated live analytics from MongoDB
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const products = await Product.find();
    const sales = await Sale.find();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todaySales = await Sale.find({ createdAt: { $gte: startOfToday } });
    const todaySalesAmount = todaySales.reduce((acc, s) => acc + s.grandTotal, 0);

    const grossRevenue = sales.reduce((acc, s) => acc + s.grandTotal, 0);

    // Calculate COGS and Gross Profit
    let totalCostOfGoodsSold = 0;
    sales.forEach(sale => {
      sale.items.forEach(item => {
        totalCostOfGoodsSold += (item.cost || (item.price * 0.6)) * item.qty;
      });
    });

    const grossProfit = Math.max(0, grossRevenue - totalCostOfGoodsSold);

    // Stock metrics
    const lowStockCount = products.filter(p => p.currentStock <= p.minStockAlert).length;
    let totalInventoryCostValuation = 0;
    let totalInventoryRetailValuation = 0;

    products.forEach(p => {
      totalInventoryCostValuation += p.costPrice * p.currentStock;
      totalInventoryRetailValuation += p.sellingPrice * p.currentStock;
    });

    const unrealizedProfit = Math.max(0, totalInventoryRetailValuation - totalInventoryCostValuation);

    res.json({
      grossRevenue,
      todaySales: todaySalesAmount,
      grossProfit,
      totalTransactions: sales.length,
      lowStockCount,
      totalProductsCount: products.length,
      valuation: {
        costValuation: totalInventoryCostValuation,
        retailValuation: totalInventoryRetailValuation,
        unrealizedProfit
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to aggregate report metrics', details: error.message });
  }
});

// GET /api/reports/stock-movements - Retrieve live stock audit movements
router.get('/stock-movements', verifyToken, async (req, res) => {
  try {
    const movements = await StockMovement.find().sort({ createdAt: -1 }).limit(100);
    res.json({ count: movements.length, movements });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve stock movements', details: error.message });
  }
});

module.exports = router;
