# ⚡ ApexStock — Smart Inventory & POS Billing Management System

An ultra-modern, enterprise-grade full-stack web application combining **Centralized Inventory Management** with a **High-Speed Point-of-Sale (POS) Billing Terminal**, role-based access control (Admin, Cashier, Inventory Manager), barcode scanning simulation, automated stock updates, customer CRM, and printable tax invoices.

---

## 🌟 Key Features

1. **High-Speed POS Billing Terminal:**
   - Real-time product lookup & hardware barcode scanning simulation.
   - Dynamic cart calculations: subtotals, item discounts (5%-20%), and custom GST / Tax rates (0%, 5%, 12%, 18%).
   - Multi-mode tender support: Cash (with automatic change due calculation), Card, UPI/QR, and Store Credit.
   - Instant stock deduction with audio feedback beep upon barcode capture.

2. **Professional Invoice & Receipt Printing:**
   - Complete itemized Tax Invoice preview with invoice numbers (`INV-2026-XXXX`).
   - Store details, GSTIN, cashier stamp, simulated barcode string, and customer name.
   - One-click native browser print / PDF export.

3. **Product & Inventory Master:**
   - Full CRUD operations with SKU, Barcode, Cost Price, Selling Price, and Unit metrics.
   - Automatic Low-Stock Warning alerts (highlighted in amber/rose when stock $\le$ threshold).
   - Inward and outward stock movement logging with reasons and audit history.
   - Export product inventory to CSV spreadsheet.

4. **Role-Based Access Control (RBAC):**
   - **Admin:** Unrestricted master access across all modules, configuration, and reports.
   - **Cashier:** Optimized streamlined access focusing on POS Billing, customer management, and invoices.
   - **Inventory Manager:** Products, categories, suppliers, stock movements, and valuation reports.

5. **Customer Relationship Management (CRM) & Suppliers:**
   - Track customer profiles, lifetime purchase value, and order history.
   - Supplier directories with supplied categories and inward purchase recording.

6. **Executive Analytics & Reporting:**
   - Daily and gross sales metrics, gross profit estimation ($Sales - COGS$).
   - Interactive weekly revenue trend visualizer.
   - Inventory valuation at cost vs. retail and potential profit.
   - Export sales reports to CSV.

---

## 🚀 Quick Start Guide

### Option 1: Instant Browser Launch (Zero-Setup)
You can directly open `index.html` in any modern web browser:
```text
C:\Users\Hello!\.gemini\antigravity\scratch\smart-inventory-billing\index.html
```
All features (POS, barcode scan, invoices, stock deductions, role switching, reports) run immediately out-of-the-box with `localStorage` persistence!

---

#### 1. Database Setup (MongoDB)
Ensure MongoDB is running locally (or copy your MongoDB Atlas connection string into `backend/.env`):
```text
MONGODB_URI=mongodb://127.0.0.1:27017/smart_inventory
```

To seed initial products, users, suppliers, and customers into MongoDB:
```bash
cd backend
npm run seed
```

#### 2. Backend API Setup
```bash
cd backend
npm install
npm run dev
```
The server will connect to MongoDB and start on `http://localhost:5000`.
The server will run on `http://localhost:5000`.

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to access the React interface.

---

## 📁 Repository Structure

```text
smart-inventory-billing/
│
├── index.html               # Production standalone web application (all features embedded)
├── .env.example             # Environment configuration template
├── .gitignore
├── README.md                # Main documentation
│
├── frontend/                # React.js SPA
│   ├── src/
│   │   ├── services/api.js  # REST API Client
│   │   ├── App.jsx          # React Application Dashboard
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                 # Node.js + Express API
│   ├── config/db.js         # MySQL Connection Pool
│   ├── middleware/          # JWT & Role Authorization
│   ├── routes/              # Auth, Products, POS, Customers, Suppliers, Reports
│   ├── app.js               # Express application entry
│   └── package.json
│
├── database/                # Relational Database scripts
│   ├── schema.sql           # Complete 11-table relational schema
│   └── seed.sql             # Realistic enterprise seed data
│
└── docs/                    # Technical documentation
    ├── API.md               # REST API endpoints & payload reference
    └── PROJECT_DOCUMENTATION.md
```

---

## 🔐 Credentials & Demo Data

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Admin** | `admin@apexstock.com` | `password123` | Full System Access |
| **Cashier** | `cashier@apexstock.com` | `password123` | POS Billing, Invoices, Customers |
| **Inventory Manager** | `manager@apexstock.com` | `password123` | Products, Stock In/Out, Suppliers, Reports |

---

*Crafted for academic excellence and enterprise deployment.*
