import { apiClient } from './api';

export const supplierService = {
  getAll: async (params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiClient.get(`/suppliers${query}`);
  },

  getById: async (id) => {
    return apiClient.get(`/suppliers/${id}`);
  },

  create: async (data) => {
    const payload = {
      name: data.name,
      contactPerson: data.contactPerson || data.contact || '',
      contact: data.contact || data.contactPerson || '',
      phone: data.phone,
      email: data.email || '',
      address: data.address || '',
      categoriesSupplied: data.categoriesSupplied || data.categories || '',
      categories: data.categories || data.categoriesSupplied || ''
    };
    return apiClient.post('/suppliers', payload);
  },

  update: async (id, data) => {
    return apiClient.put(`/suppliers/${id}`, data);
  },

  delete: async (id) => {
    return apiClient.delete(`/suppliers/${id}`);
  }
};
