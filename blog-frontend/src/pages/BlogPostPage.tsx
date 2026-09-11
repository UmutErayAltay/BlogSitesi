import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Skeleton,
  Grid
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getPost, updateComment, deleteComment } from '../services/blogService';
import { BlogPost } from '../types/blog';
import CommentForm from '../components/Comments/CommentForm';
import SearchBar from '../components/Search/SearchBar';
import CategoryList from '../components/Category/CategoryList';
import ShareButtons from '../components/Share/ShareButtons';
import CommentItem from '../components/Comments/CommentItem';
import { useNavigate } from 'react-router-dom';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPost = async () => {
      try {
        if (id) {
          const data = await getPost(parseInt(id));
          setPost(data);
        }
      } catch (err: any) {
        setError(err.message || 'Blog yazısı yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  // Arama işleyicisi
  const handleSearch = useCallback((searchTerm: string) => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  }, [navigate]);

  // Yorum eklendiğinde postu yeniden yükle
  const handleCommentAdded = async () => {
    if (id) {
      const data = await getPost(parseInt(id));
      setPost(data);
    }
  };

  const handleEditComment = async (commentId: number, newContent: string) => {
    try {
      await updateComment(commentId, { content: newContent });
      // Yorumları yenile
      if (id) {
        const data = await getPost(parseInt(id));
        setPost(data);
      }
    } catch (error) {
      console.error('Yorum düzenleme hatası:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      // Yorumları yenile
      if (id) {
        const data = await getPost(parseInt(id));
        setPost(data);
      }
    } catch (error) {
      console.error('Yorum silme hatası:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Skeleton variant="text" height={60} />
          <Skeleton variant="text" height={30} />
          <Skeleton variant="rectangular" height={400} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography>Blog yazısı bulunamadı</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {post.title}
            </Typography>
            
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {new Date(post.date).toLocaleDateString('tr-TR')} - {post.author.name}
            </Typography>

            {post.imageUrl && (
              <Box sx={{ my: 2 }}>
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                />
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <div dangerouslySetInnerHTML={{ __html: post.content }} />

            <Box sx={{ mt: 3 }}>
              <ShareButtons 
                url={window.location.href} 
                title={post?.title || ''} 
              />
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Yorumlar
              </Typography>
              <CommentForm postId={post?.id || 0} onCommentAdded={handleCommentAdded} />
              
              {/* Yorumları göster */}
              {post?.comments?.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Blog'da Ara
              </Typography>
              <SearchBar onSearch={handleSearch} />
            </Paper>
            
            <Paper elevation={3} sx={{ p: 2 }}>
              <CategoryList />
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BlogPostPage; 