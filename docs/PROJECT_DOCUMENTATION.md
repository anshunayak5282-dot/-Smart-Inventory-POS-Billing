# Project Documentation & Architecture Guide

## 1. System Architecture

The **Smart Inventory & Billing Management System** adopts a modern 3-tier architecture:
- **Presentation Layer**: Responsive React / Standalone Single-Page Application with Tailwind CSS and Web Audio API.
- **Application & API Layer**: Node.js & Express RESTful microservices with JWT-based RBAC.
- **Data Layer**: Relational MySQL/PostgreSQL storage with transactional integrity, foreign keys, and audit logs.

```text
+-------------------------------------------------------+
|              CLIENT / PRESENTATION LAYER             |
|   POS Terminal  |  Inventory Master  |  Analytics     |
+-------------------------------------------------------+
                           │ REST / JSON
                           ▼
+-------------------------------------------------------+
|               NODE.JS / EXPRESS BACKEND              |
|   JWT Auth   |  RBAC Middleware  |  Business Logic    |
+-------------------------------------------------------+
                           │ SQL Queries / Pool
                           ▼
+-------------------------------------------------------+
|             RELATIONAL DATABASE (MySQL)               |
| Products | Sales | Items | Stock_History | Customers  |
+-------------------------------------------------------+
```

## 2. Role-Based Access Matrix

| Feature / Module | Admin | Cashier | Inventory Manager |
|---|:---:|:---:|:---:|
| Executive Analytics Dashboard | ✅ Full | ❌ | ✅ Read-Only |
| POS Terminal & Checkout | ✅ Full | ✅ Full | ❌ |
| Invoices & Transaction History | ✅ Full | ✅ Full | ❌ |
| Product Catalog Management | ✅ Full | ❌ | ✅ Full |
| Stock Inward / Outward Entry | ✅ Full | ❌ | ✅ Full |
| Customer Profile Management | ✅ Full | ✅ Full | ❌ |
| Supplier Directory | ✅ Full | ❌ | ✅ Full |
| Financial Valuation Reports | ✅ Full | ❌ | ✅ Full |
| Store Profile & Tax Settings | ✅ Full | ❌ | ❌ |

## 3. Stock Movement Integrity

Every transaction automatically creates a log in `stock_history`:
- **Sales**: Stock is deducted and an `OUT` record is logged referencing the invoice.
- **Supplier Receipts**: Stock is incremented and an `IN` record is logged with invoice reference.
- **Damage/Audit Adjustments**: Stock is deducted/adjusted with a reason tag.
