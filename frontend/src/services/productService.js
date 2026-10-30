import { apiClient } from './api';

export const productService = {
  getAll: async (params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiClient.get(`/products${query}`);
  },

  getById: async (id) => {
    return apiClient.get(`/products/${id}`);
  },

  create: async (data) => {
    // Send both field naming conventions so backend never fails validation
    const payload = {
      ...data,
      costPrice: data.costPrice !== undefined ? Number(data.costPrice) : Number(data.cost),
      sellingPrice: data.sellingPrice !== undefined ? Number(data.sellingPrice) : Number(data.price),
      currentStock: data.currentStock !== undefined ? Number(data.currentStock) : (data.stock !== undefined ? Number(data.stock) : 0),
      minStockAlert: data.minStockAlert !== undefined ? Number(data.minStockAlert) : (data.minStock !== undefined ? Number(data.minStock) : 10)
    };
    return apiClient.post('/products', payload);
  },

  update: async (id, data) => {
    const payload = {
      ...data,
      costPrice: data.costPrice !== undefined ? Number(data.costPrice) : (data.cost !== undefined ? Number(data.cost) : undefined),
      sellingPrice: data.sellingPrice !== undefined ? Number(data.sellingPrice) : (data.price !== undefined ? Number(data.price) : undefined),
      currentStock: data.currentStock !== undefined ? Number(data.currentStock) : (data.stock !== undefined ? Number(data.stock) : undefined),
      minStockAlert: data.minStockAlert !== undefined ? Number(data.minStockAlert) : (data.minStock !== undefined ? Number(data.minStock) : undefined)
    };
    return apiClient.put(`/products/${id}`, payload);
  },

  delete: async (id) => {
    return apiClient.delete(`/products/${id}`);
  },

  adjustStock: async (data) => {
    return apiClient.post('/products/stock-adjust', data);
  }
};
