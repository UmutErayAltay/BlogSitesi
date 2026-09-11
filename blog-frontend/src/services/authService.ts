import api from './api';
import { LoginCredentials, RegisterCredentials } from '../types/auth';

// Kullanıcı girişi
export const login = async (credentials: LoginCredentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Kullanıcı kaydı
export const register = async (credentials: RegisterCredentials) => {
  try {
    const registerData = {
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
      confirmPassword: credentials.confirmPassword
    };

    const response = await api.post('/auth/register', registerData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// Çıkış
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}; 