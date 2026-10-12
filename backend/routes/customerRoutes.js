const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// GET /api/customers
router.get('/', verifyToken, (req, res) => {
  res.json({ message: 'Customers loaded' });
});

// POST /api/customers
router.post('/', verifyToken, (req, res) => {
  const { name, phone, email, address } = req.body;
  res.status(201).json({ message: 'Customer registered successfully', id: Date.now() });
});

module.exports = router;
