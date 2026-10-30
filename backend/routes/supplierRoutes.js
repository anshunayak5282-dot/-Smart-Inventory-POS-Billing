const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

// GET /api/suppliers - List suppliers
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { categoriesSupplied: { $regex: search, $options: 'i' } }
      ];
    }

    const suppliers = await Supplier.find(query).sort({ createdAt: -1 });
    res.json({ count: suppliers.length, suppliers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers', details: error.message });
  }
});

// GET /api/suppliers/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching supplier', details: error.message });
  }
});

// POST /api/suppliers - Add supplier (Admin & Manager)
router.post('/', verifyToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { name, contactPerson, phone, email, address, categoriesSupplied } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Supplier name and phone are required' });
    }

    const supplier = new Supplier({
      name,
      contactPerson: contactPerson || '',
      phone,
      email: email || '',
      address: address || '',
      categoriesSupplied: categoriesSupplied || ''
    });

    await supplier.save();
    res.status(201).json({ message: 'Supplier registered successfully', supplier });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create supplier', details: error.message });
  }
});

// PUT /api/suppliers/:id (Admin & Manager)
router.put('/:id', verifyToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ message: 'Supplier updated', supplier: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update supplier', details: error.message });
  }
});

// DELETE /api/suppliers/:id (Admin only)
router.delete('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const deleted = await Supplier.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ message: 'Supplier removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete supplier', details: error.message });
  }
});

module.exports = router;
