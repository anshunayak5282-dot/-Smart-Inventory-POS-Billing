const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

// GET /api/suppliers
router.get('/', verifyToken, (req, res) => {
  res.json({ message: 'Suppliers loaded' });
});

// POST /api/suppliers
router.post('/', verifyToken, authorizeRoles('admin', 'manager'), (req, res) => {
  const { name, contactPerson, phone, email, categoriesSupplied } = req.body;
  res.status(201).json({ message: 'Supplier registered', id: Date.now() });
});

module.exports = router;
