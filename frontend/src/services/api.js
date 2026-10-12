const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  async get(endpoint) {
    const token = localStorage.getItem('apex_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return response.json();
  },

  async post(endpoint, data) {
    const token = localStorage.getItem('apex_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return response.json();
  }
};
