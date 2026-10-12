const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock user repository for demonstration
const USERS = [
  { id: 1, name: 'John Doe', email: 'admin@apexstock.com', role: 'admin', passwordHash: '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890' },
  { id: 2, name: 'Maria Gomez', email: 'cashier@apexstock.com', role: 'cashier', passwordHash: '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890' },
  { id: 3, name: 'Alex Rivera', email: 'manager@apexstock.com', role: 'manager', passwordHash: '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890' }
];

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'apex_secret_key_2026',
    { expiresIn: '8h' }
  );

  res.json({
    message: 'Authentication successful',
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

module.exports = router;
