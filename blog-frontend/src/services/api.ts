import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:7123/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor - her istekte token ekle
api.interceptors.request.use(
  (config) => {
    console.log('API İsteği:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('İstek Hatası:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - 401 hatalarını yakala
api.interceptors.response.use(
  (response) => {
    console.log('API Yanıtı:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('API bağlantı hatası:', error.message);
      return Promise.reject(new Error('API sunucusuna bağlanılamıyor. Lütfen sunucunun çalıştığından emin olun.'));
    }
    
    console.error('API Hatası:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api; 