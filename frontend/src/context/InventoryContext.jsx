import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { customerService } from '../services/customerService';
import { supplierService } from '../services/supplierService';
import { saleService } from '../services/saleService';

const InventoryContext = createContext();

const INITIAL_PRODUCTS = [
  { id: 'prod_1', name: 'Fresh Farm Whole Milk 1L', category: 'Dairy & Bakery', sku: 'MLK-001', barcode: '8901001', cost: 35.00, price: 65.00, stock: 45, minStock: 15, unit: 'bottle' },
  { id: 'prod_2', name: 'Artisan Sourdough Bread 500g', category: 'Dairy & Bakery', sku: 'BRD-002', barcode: '8901002', cost: 28.00, price: 50.00, stock: 22, minStock: 10, unit: 'loaf' },
  { id: 'prod_3', name: 'Salted Golden Butter 200g', category: 'Dairy & Bakery', sku: 'BTR-003', barcode: '8901003', cost: 42.00, price: 58.00, stock: 8, minStock: 12, unit: 'pack' },
  { id: 'prod_4', name: 'Organic Cold Brew Coffee 330ml', category: 'Beverages', sku: 'BEV-004', barcode: '8901004', cost: 60.00, price: 120.00, stock: 60, minStock: 20, unit: 'can' },
  { id: 'prod_5', name: 'Sparkling Lemon Water 500ml', category: 'Beverages', sku: 'BEV-005', barcode: '8901005', cost: 15.00, price: 35.00, stock: 75, minStock: 25, unit: 'bottle' },
  { id: 'prod_6', name: 'Premium Earl Grey Tea Box (50s)', category: 'Beverages', sku: 'BEV-006', barcode: '8901006', cost: 180.00, price: 299.00, stock: 5, minStock: 10, unit: 'box' },
  { id: 'prod_7', name: 'Truffle Potato Chips 150g', category: 'Snacks & Food', sku: 'SNK-007', barcode: '8901007', cost: 22.00, price: 45.00, stock: 35, minStock: 15, unit: 'bag' },
  { id: 'prod_8', name: 'Dark Chocolate Almonds 200g', category: 'Snacks & Food', sku: 'SNK-008', barcode: '8901008', cost: 140.00, price: 240.00, stock: 18, minStock: 12, unit: 'pack' },
  { id: 'prod_9', name: 'Roasted Cashew Nuts 250g', category: 'Snacks & Food', sku: 'SNK-009', barcode: '8901009', cost: 190.00, price: 340.00, stock: 4, minStock: 10, unit: 'jar' },
  { id: 'prod_10', name: 'Type-C Braided Fast Cable 2m', category: 'Electronics', sku: 'ELC-010', barcode: '8901010', cost: 110.00, price: 299.00, stock: 30, minStock: 8, unit: 'pcs' },
  { id: 'prod_11', name: 'Wireless Bluetooth Earbuds Pro', category: 'Electronics', sku: 'ELC-011', barcode: '8901011', cost: 550.00, price: 1299.00, stock: 14, minStock: 5, unit: 'unit' },
  { id: 'prod_12', name: 'Fast 65W GaN Wall Charger', category: 'Electronics', sku: 'ELC-012', barcode: '8901012', cost: 650.00, price: 1499.00, stock: 2, minStock: 6, unit: 'unit' },
  { id: 'prod_13', name: 'Organic Herbal Hand Wash 300ml', category: 'Personal Care', sku: 'CAR-013', barcode: '8901013', cost: 65.00, price: 120.00, stock: 40, minStock: 15, unit: 'bottle' },
  { id: 'prod_14', name: 'Natural Mint Toothpaste 120g', category: 'Personal Care', sku: 'CAR-014', barcode: '8901014', cost: 45.00, price: 85.00, stock: 55, minStock: 20, unit: 'tube' },
  { id: 'prod_15', name: 'Microfiber Cleaning Towels (4pk)', category: 'Household', sku: 'HSD-015', barcode: '8901015', cost: 85.00, price: 160.00, stock: 28, minStock: 10, unit: 'pack' },
  { id: 'prod_16', name: 'Eco Dishwashing Liquid 750ml', category: 'Household', sku: 'HSD-016', barcode: '8901016', cost: 65.00, price: 125.00, stock: 3, minStock: 8, unit: 'bottle' }
];

const INITIAL_CUSTOMERS = [
  { id: 'cust_1', name: 'Priya Sharma', phone: '+91 98201 23456', email: 'priya.sharma@techcorp.in', city: 'Mumbai, MH', totalSpent: 12450.00, orders: 14 },
  { id: 'cust_2', name: 'Rahul Mehta', phone: '+91 98334 56789', email: 'rahul.m@outlook.com', city: 'Bengaluru, KA', totalSpent: 8750.00, orders: 8 },
  { id: 'cust_3', name: 'Ananya Patel', phone: '+91 97123 45678', email: 'ananya.p@gmail.com', city: 'Ahmedabad, GJ', totalSpent: 15800.00, orders: 21 },
  { id: 'cust_4', name: 'Rohit Verma', phone: '+91 99112 23344', email: 'rohit.v@indiamail.in', city: 'New Delhi, DL', totalSpent: 4250.00, orders: 4 },
  { id: 'cust_5', name: 'Deepak Nair', phone: '+91 94471 99887', email: 'deepak.nair@icloud.com', city: 'Kochi, KL', totalSpent: 9600.00, orders: 11 }
];

const INITIAL_SUPPLIERS = [
  { id: 'supp_1', name: 'Amrit Valley Dairy & Agro', contact: 'Suresh Patel', phone: '+91 98210 11223', email: 'orders@amritvalley.in', categories: 'Dairy & Bakery' },
  { id: 'supp_2', name: 'Himalayan Beverage Distributors', contact: 'Kavita Sen', phone: '+91 98450 33445', email: 'sales@himalayanbev.in', categories: 'Beverages' },
  { id: 'supp_3', name: 'Annapurna Foods & Snacks', contact: 'Vijay Kapoor', phone: '+91 98100 55667', email: 'vijay@annapurnafoods.in', categories: 'Snacks & Food' },
  { id: 'supp_4', name: 'Bharat Tech Innovations Hub', contact: 'Arun Iyer', phone: '+91 98800 77889', email: 'b2b@bharattech.in', categories: 'Electronics' },
  { id: 'supp_5', name: 'Prakriti Herbal & Care Ltd', contact: 'Meera Rao', phone: '+91 94480 99001', email: 'care@prakritiherbal.in', categories: 'Personal Care, Household' }
];

const INITIAL_SALES = [
  {
    id: 'sale_1',
    invoiceNo: 'INV-2026-0001',
    date: '2026-10-08 09:15',
    customerName: 'Priya Sharma',
    customerId: 'cust_1',
    paymentMethod: 'upi',
    items: [
      { productId: 'prod_11', name: 'Wireless Bluetooth Earbuds Pro', qty: 1, price: 1299.00, cost: 550.00, total: 1299.00 },
      { productId: 'prod_10', name: 'Type-C Braided Fast Cable 2m', qty: 1, price: 299.00, cost: 110.00, total: 299.00 }
    ],
    subtotal: 1598.00,
    discountPercent: 10,
    discountAmount: 159.80,
    taxPercent: 18,
    taxAmount: 258.88,
    grandTotal: 1697.08,
    cashier: 'John Doe'
  },
  {
    id: 'sale_2',
    invoiceNo: 'INV-2026-0002',
    date: '2026-10-08 10:42',
    customerName: 'Rahul Mehta',
    customerId: 'cust_2',
    paymentMethod: 'cash',
    items: [
      { productId: 'prod_1', name: 'Fresh Farm Whole Milk 1L', qty: 2, price: 65.00, cost: 35.00, total: 130.00 },
      { productId: 'prod_2', name: 'Artisan Sourdough Bread 500g', qty: 1, price: 50.00, cost: 28.00, total: 50.00 },
      { productId: 'prod_4', name: 'Organic Cold Brew Coffee 330ml', qty: 2, price: 120.00, cost: 60.00, total: 240.00 }
    ],
    subtotal: 420.00,
    discountPercent: 0,
    discountAmount: 0.00,
    taxPercent: 18,
    taxAmount: 75.60,
    grandTotal: 495.60,
    cashier: 'John Doe'
  }
];

const INITIAL_STOCK_MOVEMENTS = [
  { id: 'mov_1', timestamp: '2026-10-08 08:30', productName: 'Fresh Farm Whole Milk 1L', type: 'IN', qty: 50, prevQty: 0, newQty: 50, reason: 'Purchase from Amrit Valley Dairy', user: 'Admin' },
  { id: 'mov_2', timestamp: '2026-10-08 09:15', productName: 'Wireless Bluetooth Earbuds Pro', type: 'OUT', qty: 1, prevQty: 15, newQty: 14, reason: 'Sale: INV-2026-0001', user: 'Cashier' }
];

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('apex_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('apex_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('apex_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('apex_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [stockMovements, setStockMovements] = useState(() => {
    const saved = localStorage.getItem('apex_stockMovements');
    return saved ? JSON.parse(saved) : INITIAL_STOCK_MOVEMENTS;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('apex_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate to Indian Rupee (₹) if previously set to '$'
        if (parsed.currency === '$' || !parsed.currency) {
          parsed.currency = '₹';
        }
        return parsed;
      } catch (e) {}
    }
    return {
      name: 'Apex Retail Hypermarket',
      gst: 'GSTIN27AABCU9603R1ZM',
      address: 'Plot 42, Bandra Kurla Complex, Mumbai, MH 400051',
      phone: '+91 98765 43210 | billing@apexstock.in',
      currency: '₹',
      footer: 'Thank you for your business! Goods once sold can be returned within 7 days.'
    };
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('apex_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('apex_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('apex_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('apex_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('apex_stockMovements', JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem('apex_settings', JSON.stringify(settings));
  }, [settings]);

  // Sync live products from backend MongoDB on initial mount
  useEffect(() => {
    let isMounted = true;
    const fetchLiveProducts = async () => {
      try {
        const res = await productService.getAll();
        if (isMounted && res && res.products && Array.isArray(res.products) && res.products.length > 0) {
          setProducts(res.products);
          localStorage.setItem('apex_products', JSON.stringify(res.products));
        }
      } catch (err) {
        console.warn('Backend not responding or empty, using cached inventory:', err.message);
      }
    };
    fetchLiveProducts();
    return () => { isMounted = false; };
  }, []);

  // Sync live customers from backend MongoDB on initial mount
  useEffect(() => {
    let isMounted = true;
    const fetchLiveCustomers = async () => {
      try {
        const res = await customerService.getAll();
        if (isMounted && res && res.customers && Array.isArray(res.customers) && res.customers.length > 0) {
          setCustomers(res.customers);
          localStorage.setItem('apex_customers', JSON.stringify(res.customers));
        }
      } catch (err) {
        console.warn('Backend customers offline or empty, using cached customer list:', err.message);
      }
    };
    fetchLiveCustomers();
    return () => { isMounted = false; };
  }, []);

  // Sync live suppliers from backend MongoDB on initial mount
  useEffect(() => {
    let isMounted = true;
    const fetchLiveSuppliers = async () => {
      try {
        const res = await supplierService.getAll();
        if (isMounted && res && res.suppliers && Array.isArray(res.suppliers) && res.suppliers.length > 0) {
          setSuppliers(res.suppliers);
          localStorage.setItem('apex_suppliers', JSON.stringify(res.suppliers));
        }
      } catch (err) {
        console.warn('Backend suppliers offline or empty, using cached supplier list:', err.message);
      }
    };
    fetchLiveSuppliers();
    return () => { isMounted = false; };
  }, []);

  // CRUD Operations synced with MongoDB
  const addProduct = async (newProd) => {
    try {
      // Send directly to Node.js / Express -> MongoDB
      const res = await productService.create(newProd);
      const createdProd = res.product || { ...newProd, id: res.id || 'prod_' + Date.now() };
      setProducts(prev => [createdProd, ...prev]);
      return { success: true, product: createdProd };
    } catch (err) {
      console.warn('Could not save to MongoDB backend, falling back to local storage:', err.message);
      const localProd = { ...newProd, id: 'prod_' + Date.now() };
      setProducts(prev => [localProd, ...prev]);
      return { success: false, product: localProd, error: err.message };
    }
  };

  const updateProduct = async (id, updated) => {
    setProducts(prev => prev.map(p => (p.id === id || p._id === id) ? { ...p, ...updated } : p));
    try {
      await productService.update(id, updated);
    } catch (err) {
      console.warn('Backend product update error:', err.message);
    }
  };

  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p.id !== id && p._id !== id));
    try {
      await productService.delete(id);
    } catch (err) {
      console.warn('Backend product deletion error:', err.message);
    }
  };

  const recordStockIn = async (productId, qty, supplierName, invoiceRef, notes, userRole) => {
    const prod = products.find(p => p.id === productId || p._id === productId);
    if (!prod) return;

    const prevQty = prod.stock !== undefined ? prod.stock : (prod.currentStock || 0);
    const newQty = prevQty + qty;

    updateProduct(prod.id || prod._id, { stock: newQty, currentStock: newQty });

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

    setStockMovements(prev => [
      {
        id: 'mov_' + Date.now(),
        timestamp: dateStr,
        productName: prod.name,
        type: 'IN',
        qty,
        prevQty,
        newQty,
        reason: `Purchase Inward ${invoiceRef ? '(' + invoiceRef + ')' : ''} from ${supplierName || 'Vendor'} ${notes ? '- ' + notes : ''}`,
        user: userRole
      },
      ...prev
    ]);

    try {
      await productService.adjustStock({
        productId: prod._id || prod.id,
        type: 'IN',
        qty,
        reason: `Purchase Inward from ${supplierName || 'Vendor'}`
      });
    } catch (err) {
      console.warn('Backend stock adjustment failed:', err.message);
    }
  };

  const recordStockOut = async (productId, qty, reason, notes, userRole) => {
    const prod = products.find(p => p.id === productId || p._id === productId);
    if (!prod) return;

    const prevQty = prod.stock !== undefined ? prod.stock : (prod.currentStock || 0);
    const newQty = Math.max(0, prevQty - qty);

    updateProduct(prod.id || prod._id, { stock: newQty, currentStock: newQty });

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

    setStockMovements(prev => [
      {
        id: 'mov_' + Date.now(),
        timestamp: dateStr,
        productName: prod.name,
        type: 'OUT',
        qty,
        prevQty,
        newQty,
        reason: `${reason} ${notes ? '- ' + notes : ''}`,
        user: userRole
      },
      ...prev
    ]);

    try {
      await productService.adjustStock({
        productId: prod._id || prod.id,
        type: 'OUT',
        qty,
        reason: `${reason} ${notes || ''}`
      });
    } catch (err) {
      console.warn('Backend stock adjustment failed:', err.message);
    }
  };

  const addCustomer = async (customerData) => {
    try {
      // Send directly to Node.js / Express -> MongoDB
      const res = await customerService.create(customerData);
      const createdCust = res.customer || {
        ...customerData,
        id: res.id || 'cust_' + Date.now(),
        totalSpent: 0,
        orders: 0
      };
      setCustomers(prev => [createdCust, ...prev.filter(c => c.phone !== createdCust.phone)]);
      return { success: true, customer: createdCust };
    } catch (err) {
      console.warn('Could not save customer to MongoDB backend, saving locally:', err.message);
      const localCust = { ...customerData, id: 'cust_' + Date.now(), totalSpent: 0, orders: 0 };
      setCustomers(prev => [localCust, ...prev]);
      return { success: false, customer: localCust, error: err.message };
    }
  };

  const updateCustomer = async (id, updated) => {
    setCustomers(prev => prev.map(c => (c.id === id || c._id === id) ? { ...c, ...updated } : c));
    try {
      await customerService.update(id, updated);
    } catch (err) {
      console.warn('Backend customer update error:', err.message);
    }
  };

  const deleteCustomer = async (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id && c._id !== id));
    try {
      await customerService.delete(id);
    } catch (err) {
      console.warn('Backend customer deletion error:', err.message);
    }
  };

  const addSupplier = async (supplierData) => {
    try {
      const res = await supplierService.create(supplierData);
      const createdSupp = res.supplier || { ...supplierData, id: res.id || 'supp_' + Date.now() };
      setSuppliers(prev => [createdSupp, ...prev]);
      return { success: true, supplier: createdSupp };
    } catch (err) {
      console.warn('Could not save supplier to MongoDB backend, saving locally:', err.message);
      const localSupp = { ...supplierData, id: 'supp_' + Date.now() };
      setSuppliers(prev => [localSupp, ...prev]);
      return { success: false, supplier: localSupp, error: err.message };
    }
  };

  const deleteSupplier = async (id) => {
    setSuppliers(prev => prev.filter(s => s.id !== id && s._id !== id));
    try {
      await supplierService.delete(id);
    } catch (err) {
      console.warn('Backend supplier deletion error:', err.message);
    }
  };

  const completeSale = async (saleData, userRole) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

    // Deduct stock and record movements
    saleData.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId || p._id === item.productId);
      if (prod) {
        const prevQty = prod.stock !== undefined ? prod.stock : (prod.currentStock || 0);
        const newQty = Math.max(0, prevQty - item.qty);
        prod.stock = newQty;
        prod.currentStock = newQty;

        setStockMovements(prev => [
          {
            id: 'mov_' + Date.now() + Math.random().toString(36).substr(2, 4),
            timestamp: dateStr,
            productName: prod.name,
            type: 'OUT',
            qty: item.qty,
            prevQty,
            newQty,
            reason: `POS Sale: ${saleData.invoiceNo}`,
            user: userRole
          },
          ...prev
        ]);
      }
    });

    // Update customer spend
    if (saleData.customerId && saleData.customerId !== 'walkin') {
      setCustomers(prev => prev.map(c => {
        if (c.id === saleData.customerId || c._id === saleData.customerId) {
          return {
            ...c,
            totalSpent: (c.totalSpent || 0) + saleData.grandTotal,
            orders: (c.orders || 0) + 1
          };
        }
        return c;
      }));
    }

    setSales(prev => [saleData, ...prev]);

    // Attempt backend POS checkout
    try {
      await saleService.checkout({
        items: saleData.items,
        customerId: saleData.customerId,
        customerName: saleData.customerName,
        discountPercent: saleData.discountPercent,
        taxPercent: saleData.taxPercent,
        paymentMethod: saleData.paymentMethod
      });
    } catch (err) {
      console.warn('Backend sale checkout sync failed:', err.message);
    }
  };

  const resetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    setSuppliers(INITIAL_SUPPLIERS);
    setSales(INITIAL_SALES);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setSettings({
      name: 'Apex Retail Hypermarket',
      gst: 'GSTIN27AABCU9603R1ZM',
      address: 'Plot 42, Bandra Kurla Complex, Mumbai, MH 400051',
      phone: '+91 98765 43210 | billing@apexstock.in',
      currency: '₹',
      footer: 'Thank you for your business! Goods once sold can be returned within 7 days.'
    });
  };

  return (
    <InventoryContext.Provider value={{
      products,
      customers,
      suppliers,
      sales,
      stockMovements,
      settings,
      setSettings,
      addProduct,
      updateProduct,
      deleteProduct,
      recordStockIn,
      recordStockOut,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addSupplier,
      deleteSupplier,
      completeSale,
      resetDemoData
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
