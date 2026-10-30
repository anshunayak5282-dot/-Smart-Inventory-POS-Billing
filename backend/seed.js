const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Customer = require('./models/Customer');
const Supplier = require('./models/Supplier');
const Sale = require('./models/Sale');
const StockMovement = require('./models/StockMovement');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_inventory';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Supplier.deleteMany({});
    await Sale.deleteMany({});
    await StockMovement.deleteMany({});
    console.log('🧹 Cleaned existing database collections.');

    // 1. Seed Users with hashed passwords
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      { name: 'John Doe (Admin)', email: 'admin@apexstock.com', password: passwordHash, role: 'admin' },
      { name: 'Maria Gomez (Cashier)', email: 'cashier@apexstock.com', password: passwordHash, role: 'cashier' },
      { name: 'Alex Rivera (Manager)', email: 'manager@apexstock.com', password: passwordHash, role: 'manager' }
    ]);
    console.log(`👤 Seeded ${users.length} Users (Default password: password123)`);

    // 2. Seed Products with Indian Rupee (₹) Pricing
    const productsData = [
      { name: 'Fresh Farm Whole Milk 1L', category: 'Dairy & Bakery', sku: 'MLK-001', barcode: '8901001', costPrice: 35.00, sellingPrice: 65.00, currentStock: 45, minStockAlert: 15, unit: 'bottle' },
      { name: 'Artisan Sourdough Bread 500g', category: 'Dairy & Bakery', sku: 'BRD-002', barcode: '8901002', costPrice: 28.00, sellingPrice: 50.00, currentStock: 22, minStockAlert: 10, unit: 'loaf' },
      { name: 'Salted Golden Butter 200g', category: 'Dairy & Bakery', sku: 'BTR-003', barcode: '8901003', costPrice: 42.00, sellingPrice: 58.00, currentStock: 8, minStockAlert: 12, unit: 'pack' },
      { name: 'Organic Cold Brew Coffee 330ml', category: 'Beverages', sku: 'BEV-004', barcode: '8901004', costPrice: 60.00, sellingPrice: 120.00, currentStock: 60, minStockAlert: 20, unit: 'can' },
      { name: 'Sparkling Lemon Water 500ml', category: 'Beverages', sku: 'BEV-005', barcode: '8901005', costPrice: 15.00, sellingPrice: 35.00, currentStock: 75, minStockAlert: 25, unit: 'bottle' },
      { name: 'Premium Earl Grey Tea Box (50s)', category: 'Beverages', sku: 'BEV-006', barcode: '8901006', costPrice: 180.00, sellingPrice: 299.00, currentStock: 5, minStockAlert: 10, unit: 'box' },
      { name: 'Truffle Potato Chips 150g', category: 'Snacks & Food', sku: 'SNK-007', barcode: '8901007', costPrice: 22.00, sellingPrice: 45.00, currentStock: 35, minStockAlert: 15, unit: 'bag' },
      { name: 'Dark Chocolate Almonds 200g', category: 'Snacks & Food', sku: 'SNK-008', barcode: '8901008', costPrice: 140.00, sellingPrice: 240.00, currentStock: 18, minStockAlert: 12, unit: 'pack' },
      { name: 'Roasted Cashew Nuts 250g', category: 'Snacks & Food', sku: 'SNK-009', barcode: '8901009', costPrice: 190.00, sellingPrice: 340.00, currentStock: 4, minStockAlert: 10, unit: 'jar' },
      { name: 'Type-C Braided Fast Cable 2m', category: 'Electronics', sku: 'ELC-010', barcode: '8901010', costPrice: 110.00, sellingPrice: 299.00, currentStock: 30, minStockAlert: 8, unit: 'pcs' },
      { name: 'Wireless Bluetooth Earbuds Pro', category: 'Electronics', sku: 'ELC-011', barcode: '8901011', costPrice: 550.00, sellingPrice: 1299.00, currentStock: 14, minStockAlert: 5, unit: 'unit' },
      { name: 'Fast 65W GaN Wall Charger', category: 'Electronics', sku: 'ELC-012', barcode: '8901012', costPrice: 650.00, sellingPrice: 1499.00, currentStock: 2, minStockAlert: 6, unit: 'unit' },
      { name: 'Organic Herbal Hand Wash 300ml', category: 'Personal Care', sku: 'CAR-013', barcode: '8901013', costPrice: 65.00, sellingPrice: 120.00, currentStock: 40, minStockAlert: 15, unit: 'bottle' },
      { name: 'Natural Mint Toothpaste 120g', category: 'Personal Care', sku: 'CAR-014', barcode: '8901014', costPrice: 45.00, sellingPrice: 85.00, currentStock: 55, minStockAlert: 20, unit: 'tube' },
      { name: 'Microfiber Cleaning Towels (4pk)', category: 'Household', sku: 'HSD-015', barcode: '8901015', costPrice: 85.00, sellingPrice: 160.00, currentStock: 28, minStockAlert: 10, unit: 'pack' },
      { name: 'Eco Dishwashing Liquid 750ml', category: 'Household', sku: 'HSD-016', barcode: '8901016', costPrice: 65.00, sellingPrice: 125.00, currentStock: 3, minStockAlert: 8, unit: 'bottle' }
    ];

    const products = await Product.insertMany(productsData);
    console.log(`📦 Seeded ${products.length} Products with SKU and Indian Rupee (₹) pricing.`);

    // 3. Seed Customers
    const customers = await Customer.insertMany([
      { name: 'Priya Sharma', phone: '+91 98201 23456', email: 'priya.sharma@techcorp.in', address: 'Bandra West, Mumbai', totalSpent: 12450.00, totalOrders: 14 },
      { name: 'Rahul Mehta', phone: '+91 98334 56789', email: 'rahul.m@outlook.com', address: 'Koramangala, Bengaluru', totalSpent: 8750.00, totalOrders: 8 },
      { name: 'Ananya Patel', phone: '+91 97123 45678', email: 'ananya.p@gmail.com', address: 'Navrangpura, Ahmedabad', totalSpent: 15800.00, totalOrders: 21 },
      { name: 'Rohit Verma', phone: '+91 99112 23344', email: 'rohit.v@indiamail.in', address: 'Connaught Place, New Delhi', totalSpent: 4250.00, totalOrders: 4 },
      { name: 'Deepak Nair', phone: '+91 94471 99887', email: 'deepak.nair@icloud.com', address: 'Panampilly Nagar, Kochi', totalSpent: 9600.00, totalOrders: 11 }
    ]);
    console.log(`👥 Seeded ${customers.length} Customers.`);

    // 4. Seed Suppliers
    const suppliers = await Supplier.insertMany([
      { name: 'Amrit Valley Dairy & Agro', contactPerson: 'Suresh Patel', phone: '+91 98210 11223', email: 'orders@amritvalley.in', address: 'Anand, Gujarat', categoriesSupplied: 'Dairy & Bakery' },
      { name: 'Himalayan Beverage Distributors', contactPerson: 'Kavita Sen', phone: '+91 98450 33445', email: 'sales@himalayanbev.in', address: 'Pune, Maharashtra', categoriesSupplied: 'Beverages' },
      { name: 'Annapurna Foods & Snacks', contactPerson: 'Vijay Kapoor', phone: '+91 98100 55667', email: 'vijay@annapurnafoods.in', address: 'Indore, MP', categoriesSupplied: 'Snacks & Food' },
      { name: 'Bharat Tech Innovations Hub', contactPerson: 'Arun Iyer', phone: '+91 98800 77889', email: 'b2b@bharattech.in', address: 'Bengaluru, Karnataka', categoriesSupplied: 'Electronics' },
      { name: 'Prakriti Herbal & Care Ltd', contactPerson: 'Meera Rao', phone: '+91 94480 99001', email: 'care@prakritiherbal.in', address: 'Mysuru, Karnataka', categoriesSupplied: 'Personal Care, Household' }
    ]);
    console.log(`🏢 Seeded ${suppliers.length} Suppliers.`);

    // 5. Seed initial Sales
    const earbuds = products.find(p => p.sku === 'ELC-011');
    const cable = products.find(p => p.sku === 'ELC-010');

    await Sale.create({
      invoiceNo: 'INV-2026-0001',
      customerId: customers[0]._id,
      customerName: customers[0].name,
      cashierName: 'Maria Gomez (Cashier)',
      items: [
        { productId: earbuds._id, name: earbuds.name, qty: 1, price: earbuds.sellingPrice, cost: earbuds.costPrice, total: earbuds.sellingPrice },
        { productId: cable._id, name: cable.name, qty: 1, price: cable.sellingPrice, cost: cable.costPrice, total: cable.sellingPrice }
      ],
      subtotal: earbuds.sellingPrice + cable.sellingPrice,
      discountPercent: 10,
      discountAmount: Math.round((earbuds.sellingPrice + cable.sellingPrice) * 0.1),
      taxPercent: 18,
      taxAmount: Math.round((earbuds.sellingPrice + cable.sellingPrice) * 0.9 * 0.18),
      grandTotal: Math.round((earbuds.sellingPrice + cable.sellingPrice) * 0.9 * 1.18),
      paymentMethod: 'upi',
      paymentStatus: 'paid'
    });

    console.log('🧾 Seeded initial Sale transactions in INR (₹).');

    // 6. Seed initial Stock Movements
    await StockMovement.create([
      { productId: products[0]._id, productName: products[0].name, type: 'IN', qty: 50, prevQty: 0, newQty: 50, reason: 'Purchase from Amrit Valley Dairy', user: 'admin' },
      { productId: earbuds._id, productName: earbuds.name, type: 'OUT', qty: 1, prevQty: 15, newQty: 14, reason: 'POS Sale: INV-2026-0001', user: 'cashier' }
    ]);

    console.log('🔄 Seeded initial Stock Movement audit logs.');
    console.log('\n🎉 MongoDB database seeded successfully with Indian Rupee (₹) data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding MongoDB:', error);
    process.exit(1);
  }
};

seedDatabase();
