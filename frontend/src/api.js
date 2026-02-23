import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Menu APIs
export const getMenu = (category) =>
  api.get('/menu', { params: category ? { category } : {} });

export const getCategories = () =>
  api.get('/menu/categories');

// Cart APIs
export const validateCartItem = (item_id, quantity) =>
  api.post('/cart/add', { item_id, quantity });

export const validateCartRemoval = (item_id) =>
  api.post('/cart/remove', { item_id });

// Order APIs
export const createOrder = (items, order_type = 'manual', delivery_address = '') =>
  api.post('/orders', { items, order_type, delivery_address });

export const getRecentOrders = () =>
  api.get('/orders/recent');

// Chatbot API
export const sendChatMessage = (message) =>
  api.post('/chatbot', { message });

export default api;
