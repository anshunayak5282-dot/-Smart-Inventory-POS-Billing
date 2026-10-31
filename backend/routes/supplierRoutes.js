const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

// Helper to normalize supplier format for client compatibility
const formatSupplier = (doc) => {
  if (!doc) return null;
  const s = doc.toObject ? doc.toObject() : doc;
  const idStr = s._id ? s._id.toString() : (s.id || '');
  return {
    ...s,
    id: idStr,
    contact: s.contactPerson || s.contact || '',
    contactPerson: s.contactPerson || s.contact || '',
    categories: s.categoriesSupplied || s.categories || '',
    categoriesSupplied: s.categoriesSupplied || s.categories || ''
  };
};

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
    res.json({ count: suppliers.length, suppliers: suppliers.map(formatSupplier) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers', details: error.message });
  }
});

// GET /api/suppliers/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    let supplier = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      supplier = await Supplier.findById(req.params.id);
    } else {
      supplier = await Supplier.findOne({ name: req.params.id });
    }
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json(formatSupplier(supplier));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching supplier', details: error.message });
  }
});

// POST /api/suppliers - Add supplier (Admin & Manager)
router.post('/', verifyToken, async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    const contactPerson = (req.body.contactPerson || req.body.contact || '').trim();
    const phone = (req.body.phone || '').trim();
    const email = (req.body.email || '').trim();
    const address = (req.body.address || '').trim();
    const categoriesSupplied = (req.body.categoriesSupplied || req.body.categories || '').trim();

    if (!name || !phone) {
      return res.status(400).json({ error: 'Supplier name and phone are required' });
    }

    const supplier = new Supplier({
      name,
      contactPerson,
      phone,
      email,
      address,
      categoriesSupplied
    });

    await supplier.save();
    console.log(`✅ Saved new supplier to MongoDB: ${supplier.name}`);
    res.status(201).json({ message: 'Supplier registered successfully in database', supplier: formatSupplier(supplier) });
  } catch (error) {
    console.error('Error saving supplier to MongoDB:', error);
    res.status(500).json({ error: 'Failed to create supplier', details: error.message });
  }
});

// PUT /api/suppliers/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.contact && !updateData.contactPerson) {
      updateData.contactPerson = updateData.contact;
    }
    if (updateData.categories && !updateData.categoriesSupplied) {
      updateData.categoriesSupplied = updateData.categories;
    }

    let updated = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      updated = await Supplier.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      );
    } else {
      updated = await Supplier.findOneAndUpdate(
        { name: req.params.id },
        { $set: updateData },
        { new: true }
      );
    }

    if (!updated) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ message: 'Supplier updated in database', supplier: formatSupplier(updated) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update supplier', details: error.message });
  }
});

// DELETE /api/suppliers/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    let deleted = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Supplier.findByIdAndDelete(req.params.id);
    } else {
      deleted = await Supplier.findOneAndDelete({ name: req.params.id });
    }
    if (!deleted) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ message: 'Supplier removed from database' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete supplier', details: error.message });
  }
});

module.exports = router;
