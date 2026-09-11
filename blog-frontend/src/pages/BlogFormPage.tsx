import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createPost, updatePost } from '../store/slices/blogSlice';
import { BlogPost } from '../types/blog';
import { testConnection } from '../services/blogService';

interface BlogFormData {
  title: string;
  content: string;
  summary: string;
  category: string;
  imageUrl: string;
  isDraft: boolean;
}

const initialFormData: BlogFormData = {
  title: '',
  content: '',
  summary: '',
  category: '',
  imageUrl: '',
  isDraft: true
};

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

const BlogFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = id ? parseInt(id) : undefined;
  const isEditing = !!postId;
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { posts } = useAppSelector(state => state.blog);
  const [error, setError] = useState<string | null>(null);
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (postId) {
      const post = posts.find(p => p.id === postId);
      if (post) {
        setFormData({
          title: post.title,
          content: post.content,
          summary: post.summary,
          category: post.category,
          imageUrl: post.imageUrl,
          isDraft: post.status === 'draft'
        });
      }
    }
  }, [postId, posts]);

  useEffect(() => {
    const testApi = async () => {
      try {
        const result = await testConnection();
        console.log('API Bağlantı Testi:', result);
      } catch (error) {
        console.error('API Bağlantı Hatası:', error);
      }
    };

    testApi();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.content) {
      setError('Başlık ve içerik alanları zorunludur');
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('Kullanıcı girişi yapılmamış');
      }

      const user = JSON.parse(userStr);
      if (!user || !user.id) {
        throw new Error('Geçersiz kullanıcı bilgisi');
      }

      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        summary: formData.summary.trim() || formData.title.trim(),
        category: formData.category || 'genel',
        imageUrl: formData.imageUrl.trim() || 'https://via.placeholder.com/800x400',
        authorId: user.id,
        status: formData.isDraft ? 'draft' : 'published',
        date: new Date().toISOString(),
        views: 0,
        likes: 0
      };

      if (isEditing && postId) {
        await dispatch(updatePost({
          ...postData,
          id: postId,
          author: { 
            id: user.id, 
            name: user.username 
          }
        })).unwrap();
      } else {
        await dispatch(createPost(postData)).unwrap();
      }

      navigate('/admin');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Blog yazısı kaydedilirken bir hata oluştu';
      setError(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {postId ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Başlık"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Özet"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={2}
            />

            <ReactQuill 
              ref={quillRef}
              value={formData.content}
              onChange={handleEditorChange}
              modules={modules}
              style={{ height: '300px', marginBottom: '50px' }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Kategori</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="Kategori"
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                <MenuItem value="teknoloji">Teknoloji</MenuItem>
                <MenuItem value="yazilim">Yazılım</MenuItem>
                <MenuItem value="tasarim">Tasarım</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Görsel URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              margin="normal"
              required
            />

            <FormControlLabel
              control={
                <Switch
                  checked={!formData.isDraft}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    isDraft: !e.target.checked
                  }))}
                />
              }
              label={formData.isDraft ? "Taslak" : "Yayınla"}
            />

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                Kaydet
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/admin')}
              >
                İptal
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default BlogFormPage; 