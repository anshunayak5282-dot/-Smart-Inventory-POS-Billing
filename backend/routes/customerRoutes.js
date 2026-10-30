const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

// GET /api/customers - List all customers with search
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query).sort({ totalSpent: -1 });
    res.json({ count: customers.length, customers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers', details: error.message });
  }
});

// GET /api/customers/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customer', details: error.message });
  }
});

// POST /api/customers - Create new customer
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Customer name and phone number are required' });
    }

    const existing = await Customer.findOne({ phone });
    if (existing) {
      return res.status(400).json({ error: 'Customer with this phone number already exists' });
    }

    const customer = new Customer({
      name,
      phone,
      email: email || '',
      address: address || ''
    });

    await customer.save();
    res.status(201).json({ message: 'Customer registered successfully', customer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer', details: error.message });
  }
});

// PUT /api/customers/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer updated', customer: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer', details: error.message });
  }
});

// DELETE /api/customers/:id (Admin only)
router.delete('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer', details: error.message });
  }
});

module.exports = router;
