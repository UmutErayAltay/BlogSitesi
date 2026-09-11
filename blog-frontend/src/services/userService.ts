import api from './api';

export interface UserListItem {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
}

export const getUsers = async () => {
  const response = await api.get('/user');
  return response.data;
};

export const updateUserRole = async (userId: number, role: string) => {
  const response = await api.put(`/user/${userId}/role`, { role });
  return response.data;
};

export const updateUserStatus = async (userId: number, isActive: boolean) => {
  const response = await api.put(`/user/${userId}/status`, { isActive });
  return response.data;
}; 