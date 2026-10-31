import { apiClient } from './api';

export const customerService = {
  getAll: async (params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiClient.get(`/customers${query}`);
  },

  getById: async (id) => {
    return apiClient.get(`/customers/${id}`);
  },

  create: async (data) => {
    const payload = {
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      address: data.address || data.city || '',
      city: data.city || data.address || '',
      totalSpent: Number(data.totalSpent) || 0,
      orders: Number(data.orders || data.totalOrders) || 0
    };
    return apiClient.post('/customers', payload);
  },

  update: async (id, data) => {
    const payload = {
      ...data,
      address: data.address || data.city || undefined,
      city: data.city || data.address || undefined
    };
    return apiClient.put(`/customers/${id}`, payload);
  },

  delete: async (id) => {
    return apiClient.delete(`/customers/${id}`);
  }
};
