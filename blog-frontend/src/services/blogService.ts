import api from './api';
import { BlogPost } from '../types/blog';

// LocalStorage keys
const POSTS_KEY = 'blog_posts';

// Initial sample posts
const INITIAL_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'İlk Blog Yazısı',
    content: 'İçerik...',
    summary: 'Özet...',
    category: 'teknoloji',
    imageUrl: 'https://source.unsplash.com/random/800x600',
    status: 'published',
    date: '2024-03-21',
    author: { id: 1, name: 'Admin' },
    views: 0,
    likes: 0,
    comments: []
  },
  {
    id: 2,
    title: 'İkinci Blog Yazısı',
    content: 'İçerik...',
    summary: 'Özet...',
    category: 'yazilim',
    imageUrl: 'https://source.unsplash.com/random/800x601',
    status: 'draft',
    date: '2024-03-22',
    author: { id: 1, name: 'Admin' },
    views: 0,
    likes: 0,
    comments: []
  }
];

// Initialize localStorage with sample posts if empty
const initializeStorage = () => {
  const posts = localStorage.getItem(POSTS_KEY);
  if (!posts) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS));
  }
};

// Get all posts
export const getPosts = async () => {
  const response = await api.get('/blog');
  return response.data;
};

// Get a single post
export const getPost = async (id: number) => {
  const response = await api.get(`/blog/${id}`);
  return response.data;
};

export interface CreatePostData {
  title: string;
  content: string;
  summary: string;
  category: string;
  imageUrl: string;
  authorId: number;
  status: string;
  date: string;
  views: number;
  likes: number;
}

export interface UpdatePostData extends CreatePostData {
  id: number;
  author: {
    id: number;
    name: string;
  };
}

// Create new post
export const createPost = async (post: CreatePostData) => {
  try {
    console.log('API\'ye gönderilen veri:', post);
    const response = await api.post('/blog', {
      ...post,
      status: post.status // isDraft durumuna göre gelen status'u kullan
    });
    return response.data;
  } catch (error: any) {
    console.error('Blog oluşturma hatası:', error.response?.data || error);
    throw error;
  }
};

// Update post
export const updatePost = async (post: UpdatePostData) => {
  try {
    const updateData = {
      title: post.title,
      content: post.content,
      summary: post.summary,
      category: post.category,
      imageUrl: post.imageUrl,
      status: post.status
    };

    const response = await api.put(`/blog/${post.id}`, updateData);
    return response.data;
  } catch (error: any) {
    console.error('Blog güncelleme hatası:', error.response?.data || error);
    throw error;
  }
};

// Delete post
export const deletePost = async (id: number) => {
  await api.delete(`/blog/${id}`);
  return id;
};

// API bağlantı testi
export const testConnection = async () => {
  try {
    const response = await api.get('/blog/test');
    console.log('API Test Sonucu:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API Test Hatası:', error.response?.data || error);
    throw error;
  }
};

// Tüm postları getir (admin paneli için)
export const getAllPosts = async () => {
  const response = await api.get('/blog/admin');
  return response.data;
};

export const searchPosts = async (query: string) => {
  const response = await api.get(`/blog/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

export const getPostsByCategory = async (categoryId: string) => {
  const response = await api.get(`/blog/category/${categoryId}`);
  return response.data;
};

export const addComment = async (postId: number, comment: { content: string }) => {
  const response = await api.post(`/blog/${postId}/comments`, comment);
  return response.data;
};

export const updateComment = async (commentId: number, data: { content: string }) => {
  const response = await api.put(`/blog/comments/${commentId}`, data);
  return response.data;
};

export const deleteComment = async (commentId: number) => {
  const response = await api.delete(`/blog/comments/${commentId}`);
  return response.data;
}; 