// Centralised API base URL — reads from Vite env var, falls back to localhost for dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  url: API_URL,

  async get(path: string, token?: string) {
    const res = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res;
  },

  async post(path: string, body: unknown, token?: string) {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    return res;
  },

  async put(path: string, body: unknown, token?: string) {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    return res;
  },

  async delete(path: string, token?: string) {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res;
  },
};
