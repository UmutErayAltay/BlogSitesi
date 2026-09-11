import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { BlogPost } from '../types/blog';
import { fetchAllPosts, deletePost } from '../store/slices/blogSlice';
import DeletePostDialog from '../components/Blog/DeletePostDialog';

const AdminPage: React.FC = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { posts, loading } = useAppSelector(state => state.blog);
  const { user, isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  // Eğer kullanıcı giriş yapmamışsa veya admin değilse, login sayfasına yönlendir
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const handleEdit = (postId: number) => {
    navigate(`/admin/post/edit/${postId}`);
  };

  const handleDelete = (post: BlogPost) => {
    setSelectedPost(post);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedPost) {
      await dispatch(deletePost(selectedPost.id));
      setDeleteDialogOpen(false);
      setSelectedPost(null);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Admin Paneli
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/post/new')}
          >
            Yeni Yazı
          </Button>
        </Box>

        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Başlık</TableCell>
                  <TableCell>Tarih</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell align="right">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.date}</TableCell>
                    <TableCell>{post.status}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEdit(post.id)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(post)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      {selectedPost && (
        <DeletePostDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          title={selectedPost.title}
        />
      )}
    </Container>
  );
};

export default AdminPage; 