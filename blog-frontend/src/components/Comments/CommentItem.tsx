import React, { useState } from 'react';
import { Box, Typography, IconButton, TextField, Button } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useAppSelector } from '../../hooks/redux';
import { Comment } from '../../types/blog';

interface CommentItemProps {
  comment: Comment;
  onEdit: (commentId: number, newContent: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const { user } = useAppSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';
  const isAuthor = user?.id === comment.author.id;

  const handleSave = async () => {
    if (editContent.trim() === '') return;
    await onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {comment.author.name} - {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
          </Typography>
          {isEditing ? (
            <Box sx={{ mt: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Kaydet
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                >
                  İptal
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography>{comment.content}</Typography>
          )}
        </Box>
        {(isAuthor || isAdmin) && !isEditing && (
          <Box>
            {isAuthor && (
              <IconButton size="small" onClick={() => setIsEditing(true)}>
                <EditIcon />
              </IconButton>
            )}
            <IconButton size="small" onClick={() => onDelete(comment.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommentItem; 