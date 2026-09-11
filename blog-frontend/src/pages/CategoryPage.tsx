import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Box } from '@mui/material';
import { getPostsByCategory } from '../services/blogService';
import { BlogPost } from '../types/blog';
import BlogPostCard from '../components/Blog/BlogPostCard';
import LoadingSpinner from '../components/Loading';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Kategori adını düzgün formatlayan yardımcı fonksiyon
  const formatCategoryName = (category: string | undefined): string => {
    if (!category) return 'Kategori';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        if (categoryId) {
          const data = await getPostsByCategory(categoryId);
          setPosts(data);
        }
      } catch (err: any) {
        setError(err.message || 'Kategori yazıları yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [categoryId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {formatCategoryName(categoryId)} Kategorisi
        </Typography>

        {posts.length === 0 ? (
          <Typography>Bu kategoride henüz yazı bulunmuyor.</Typography>
        ) : (
          <Grid container spacing={4}>
            {posts.map((post) => (
              <Grid item key={post.id} xs={12} sm={6} md={4}>
                <BlogPostCard post={post} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default CategoryPage; 