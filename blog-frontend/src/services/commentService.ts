import api from './api';
import { Comment } from '../types/blog';

export const getComments = async (postId: number) => {
  const response = await api.get(`/comment/post/${postId}`);
  return response.data;
};

export const createComment = async (comment: Omit<Comment, 'id' | 'author' | 'date'>) => {
  const response = await api.post('/comment', comment);
  return response.data;
};

export const deleteComment = async (id: number) => {
  await api.delete(`/comment/${id}`);
}; 