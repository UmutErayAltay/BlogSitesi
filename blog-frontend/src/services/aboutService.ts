import api from './api';

export interface About {
  id: number;
  content: string;
  lastUpdated: string;
  updatedBy: {
    id: number;
    username: string;
  };
}

export const getAbout = async () => {
  const response = await api.get('/about');
  return response.data;
};

export const updateAbout = async (content: string) => {
  const response = await api.put('/about', content);
  return response.data;
}; 