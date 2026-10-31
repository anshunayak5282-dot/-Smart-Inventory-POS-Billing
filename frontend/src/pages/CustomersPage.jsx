import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

export default function CustomersPage() {
  const { customers, addCustomer, deleteCustomer, settings } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: ''
  });

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filtered = customers.filter(c =>
    (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.phone && c.phone.includes(searchTerm)) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast('Please enter both name and phone number', 'error');
      return;
    }
    setIsSubmitting(true);
    const res = await addCustomer(formData);
    setIsSubmitting(false);

    if (res && res.success) {
      showToast(`Customer "${formData.name}" saved to MongoDB database!`, 'success');
    } else {
      showToast(`Added "${formData.name}" (local fallback)`, 'info');
    }

    setFormData({ name: '', phone: '', email: '', city: '' });
    setIsModalOpen(false);
  };

  const handleDelete = (c) => {
    if (window.confirm(`Delete customer profile for "${c.name}"?`)) {
      deleteCustomer(c.id || c._id);
      showToast(`Deleted "${c.name}"`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold text-white animate-bounce ${
          toastMessage.type === 'error' ? 'bg-rose-600' : toastMessage.type === 'info' ? 'bg-amber-600' : 'bg-emerald-600'
        }`}>
          {toastMessage.msg}
        </div>
      )}

      {/* Search & Add */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search customers by name, phone, or email..."
          className="max-w-md w-full px-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all">
          + Add Customer
        </button>
      </div>

      {/* Grid of Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-slate-400">No customers found.</div>
        ) : (
          filtered.map(c => (
            <div key={c.id || c._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{c.name}</h4>
                    <div className="text-[11px] text-slate-400">{c.city || c.address || 'Standard Customer'}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(c)}
                  title="Delete Customer"
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-all text-xs">
                  🗑️
                </button>
              </div>

              <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div><b>Phone:</b> <span className="font-mono">{c.phone}</span></div>
                <div><b>Email:</b> {c.email || 'None provided'}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Lifetime Spend:</span>
                  <div className="font-bold text-indigo-600 font-mono">
                    {settings.currency}{(c.totalSpent || 0).toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Total Orders:</span>
                  <div className="font-bold text-slate-800">{c.orders || c.totalOrders || 0} bills</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Customer Profile</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@example.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / Address</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Mumbai, MH"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-slate-700">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md">
                  {isSubmitting ? 'Saving to Database...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
