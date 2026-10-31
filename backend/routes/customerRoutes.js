const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

// Helper to normalize customer format for client compatibility
const formatCustomer = (doc) => {
  if (!doc) return null;
  const c = doc.toObject ? doc.toObject() : doc;
  const idStr = c._id ? c._id.toString() : (c.id || '');
  return {
    ...c,
    id: idStr,
    city: c.address || c.city || '',
    address: c.address || c.city || '',
    orders: c.totalOrders !== undefined ? c.totalOrders : (c.orders || 0),
    totalOrders: c.totalOrders !== undefined ? c.totalOrders : (c.orders || 0),
    totalSpent: Number(c.totalSpent) || 0
  };
};

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

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.json({ count: customers.length, customers: customers.map(formatCustomer) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers', details: error.message });
  }
});

// GET /api/customers/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    let customer = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      customer = await Customer.findById(req.params.id);
    } else {
      customer = await Customer.findOne({ phone: req.params.id });
    }
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(formatCustomer(customer));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customer', details: error.message });
  }
});

// POST /api/customers - Create or update customer in MongoDB
router.post('/', verifyToken, async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    const phone = (req.body.phone || '').trim();
    const email = (req.body.email || '').trim();
    const address = (req.body.address || req.body.city || '').trim();
    const totalSpent = Number(req.body.totalSpent) || 0;
    const totalOrders = Number(req.body.orders || req.body.totalOrders) || 0;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Customer name and phone number are required' });
    }

    // Check if customer with phone already exists
    let existing = await Customer.findOne({ phone });
    if (existing) {
      existing.name = name;
      if (email) existing.email = email;
      if (address) existing.address = address;
      if (totalSpent > 0 && !existing.totalSpent) existing.totalSpent = totalSpent;
      if (totalOrders > 0 && !existing.totalOrders) existing.totalOrders = totalOrders;
      await existing.save();
      return res.status(200).json({
        message: 'Customer profile updated successfully',
        customer: formatCustomer(existing)
      });
    }

    const customer = new Customer({
      name,
      phone,
      email: email || '',
      address: address || '',
      totalSpent,
      totalOrders
    });

    await customer.save();
    console.log(`✅ Saved new customer to MongoDB: ${customer.name} (${customer.phone})`);
    res.status(201).json({
      message: 'Customer registered successfully in database',
      customer: formatCustomer(customer)
    });
  } catch (error) {
    console.error('Error saving customer to MongoDB:', error);
    res.status(500).json({ error: 'Failed to create customer', details: error.message });
  }
});

// PUT /api/customers/:id - Update customer in MongoDB
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.city && !updateData.address) {
      updateData.address = updateData.city;
    }
    if (updateData.orders !== undefined && updateData.totalOrders === undefined) {
      updateData.totalOrders = updateData.orders;
    }

    let updated = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      updated = await Customer.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      );
    } else {
      updated = await Customer.findOneAndUpdate(
        { phone: req.params.id },
        { $set: updateData },
        { new: true }
      );
    }

    if (!updated) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer updated in database', customer: formatCustomer(updated) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer', details: error.message });
  }
});

// DELETE /api/customers/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    let deleted = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Customer.findByIdAndDelete(req.params.id);
    } else {
      deleted = await Customer.findOneAndDelete({ phone: req.params.id });
    }
    if (!deleted) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully from database' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer', details: error.message });
  }
});

module.exports = router;
