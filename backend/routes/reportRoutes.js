const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

// GET /api/reports/dashboard - Aggregated financial metrics
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    grossRevenue: 48250.00,
    todaySales: 3840.50,
    grossProfit: 14210.00,
    lowStockCount: 5,
    totalTransactions: 324
  });
});

module.exports = router;
