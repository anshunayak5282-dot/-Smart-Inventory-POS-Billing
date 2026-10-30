import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';

export default function ProductModal({ isOpen, onClose, editingProduct }) {
  const { addProduct, updateProduct, settings } = useInventory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Dairy & Bakery',
    sku: '',
    barcode: '',
    cost: '',
    price: '',
    stock: '',
    minStock: '10',
    unit: 'pcs'
  });

  useEffect(() => {
    setErrorMessage(null);
    setIsSubmitting(false);
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || 'Dairy & Bakery',
        sku: editingProduct.sku || '',
        barcode: editingProduct.barcode || '',
        cost: editingProduct.cost !== undefined ? editingProduct.cost : (editingProduct.costPrice || ''),
        price: editingProduct.price !== undefined ? editingProduct.price : (editingProduct.sellingPrice || ''),
        stock: editingProduct.stock !== undefined ? editingProduct.stock : (editingProduct.currentStock || ''),
        minStock: editingProduct.minStock !== undefined ? editingProduct.minStock : (editingProduct.minStockAlert || '10'),
        unit: editingProduct.unit || 'pcs'
      });
    } else {
      setFormData({
        name: '',
        category: 'Dairy & Bakery',
        sku: '',
        barcode: '',
        cost: '',
        price: '',
        stock: '',
        minStock: '10',
        unit: 'pcs'
      });
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      ...formData,
      cost: parseFloat(formData.cost) || 0,
      price: parseFloat(formData.price) || 0,
      costPrice: parseFloat(formData.cost) || 0,
      sellingPrice: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      currentStock: parseInt(formData.stock) || 0,
      minStock: parseInt(formData.minStock) || 10,
      minStockAlert: parseInt(formData.minStock) || 10
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id || editingProduct._id, payload);
      } else {
        await addProduct(payload);
      }
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error('Failed to save product:', err);
      setErrorMessage(err.message || 'Error communicating with database');
      setIsSubmitting(false);
    }
  };

  const currencySymbol = settings?.currency || '₹';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="font-bold text-sm">
            {editingProduct ? 'Edit Product Details' : 'Add New Product to Database'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        {errorMessage && (
          <div className="m-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Amul Fresh Milk 1L"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500">
                <option value="Dairy & Bakery">Dairy & Bakery</option>
                <option value="Beverages">Beverages</option>
                <option value="Snacks & Food">Snacks & Food</option>
                <option value="Electronics">Electronics</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Household">Household</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">SKU / Code *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                placeholder="MLK-101"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Barcode Numbers *</label>
              <input
                type="text"
                required
                value={formData.barcode}
                onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="8901001"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Unit of Measure</label>
              <input
                type="text"
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                placeholder="pcs / bottle / kg"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cost Price ({currencySymbol}) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.cost}
                onChange={e => setFormData({ ...formData, cost: e.target.value })}
                placeholder="35.00"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Selling Price ({currencySymbol}) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="65.00"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Stock Qty *</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                placeholder="50"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Min Alert Threshold *</label>
              <input
                type="number"
                required
                value={formData.minStock}
                onChange={e => setFormData({ ...formData, minStock: e.target.value })}
                placeholder="10"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md disabled:opacity-60 flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving to MongoDB...</span>
                </>
              ) : (
                <span>Save Product</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
