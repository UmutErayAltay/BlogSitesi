import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Avatar } from '@mui/material';
import { ThumbUp } from '@mui/icons-material';
import { formatDistance } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addComment } from '../../store/slices/blogSlice';
import { Comment } from '../../types/blog';

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments }) => {
  const [comment, setComment] = useState('');
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await dispatch(addComment({
        postId,
        content: comment.trim()
      }));
      setComment('');
    } catch (error) {
      console.error('Yorum eklenirken hata:', error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Yorumlar ({comments.length})
      </Typography>

      {user && (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Yorumunuzu yazın..."
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!comment.trim()}
          >
            Yorum Yap
          </Button>
        </Box>
      )}

      {comments.map((comment) => (
        <Box
          key={comment.id}
          sx={{
            display: 'flex',
            gap: 2,
            mb: 2,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 1
          }}
        >
          <Avatar
            src={comment.author.avatar}
            alt={comment.author.name}
          />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle2">
                {comment.author.name}
              </Typography>
              <Typography component="span" variant="caption" color="text.secondary">
                {formatDistance(new Date(comment.createdAt), new Date(), { 
                  addSuffix: true,
                  locale: tr 
                })}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {comment.content}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CommentSection; 