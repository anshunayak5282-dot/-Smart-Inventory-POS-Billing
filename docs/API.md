# Smart Inventory & Billing Management System — API Specification

Base URL: `http://localhost:5000/api`

---

### 1. Authentication (`/api/auth`)

#### `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "admin@apexstock.com",
    "password": "password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Authentication successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "admin@apexstock.com",
      "role": "admin"
    }
  }
  ```

---

### 2. Products & Inventory (`/api/products`)

#### `GET /api/products`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `category`, `search`, `stock_status`

#### `POST /api/products` (Admin / Manager)
- **Request Body:**
  ```json
  {
    "name": "Organic Whole Milk 1L",
    "categoryId": 1,
    "sku": "MLK-001",
    "barcode": "8901001",
    "costPrice": 1.80,
    "sellingPrice": 2.99,
    "stock": 45,
    "minStockAlert": 15,
    "unit": "bottle"
  }
  ```

---

### 3. POS Billing & Checkout (`/api/pos`)

#### `POST /api/pos/checkout`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "customerId": "cust_1",
    "discountPercent": 10,
    "taxPercent": 18,
    "paymentMethod": "cash",
    "items": [
      { "productId": "prod_1", "qty": 2, "price": 2.99 }
    ]
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Sale finalized and inventory updated",
    "invoiceNo": "INV-2026-0004",
    "timestamp": "2026-10-08T12:30:00Z"
  }
  ```

---

### 4. Reports & Dashboards (`/api/reports`)

#### `GET /api/reports/dashboard`
- **Response:**
  ```json
  {
    "grossRevenue": 48250.00,
    "todaySales": 3840.50,
    "grossProfit": 14210.00,
    "lowStockCount": 5,
    "totalTransactions": 324
  }
  ```
