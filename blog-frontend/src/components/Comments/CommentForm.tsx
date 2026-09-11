import React, { useState } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addComment } from '../../store/slices/blogSlice';

interface CommentFormProps {
  postId: number;
  onCommentAdded?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Yorum boş olamaz');
      return;
    }

    try {
      await dispatch(addComment({
        postId,
        content: content.trim()
      })).unwrap();
      
      setContent('');
      setError(null);
      onCommentAdded?.();
    } catch (err: any) {
      setError(err.message || 'Yorum eklenirken bir hata oluştu');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        fullWidth
        multiline
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Yorumunuzu yazın..."
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!user}
      >
        {user ? 'Yorum Yap' : 'Yorum yapmak için giriş yapın'}
      </Button>
    </Box>
  );
};

export default CommentForm; 