import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Añadir interceptor para incluir el token de autenticación
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export const getAssets = () => api.get('/assets/');
export const createOrder = (order) => api.post('/orders/', order);
export const login = (credentials) => api.post('/token/', credentials);
export const getAssetPrice = (assetSymbol) => api.get(`/assets/${assetSymbol}/price/`);
