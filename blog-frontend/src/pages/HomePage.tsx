import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Grid, Box, Paper } from '@mui/material';
import { getPosts } from '../services/blogService';
import { BlogPost } from '../types/blog';
import BlogPostCard from '../components/Blog/BlogPostCard';
import SearchBar from '../components/Search/SearchBar';
import LoadingSpinner from '../components/Loading';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        setPosts(data);
        setFilteredPosts(data);
      } catch (err: any) {
        setError(err.message || 'Blog yazıları yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleSearch = useCallback((searchTerm: string) => {
    if (searchTerm.trim() === '') {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [posts]);

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
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Blog Yazıları
            </Typography>
          </Box>

          {filteredPosts.length === 0 ? (
            <Typography>Gösterilecek yazı bulunamadı.</Typography>
          ) : (
            <Grid container spacing={4}>
              {filteredPosts.map((post) => (
                <Grid item key={post.id} xs={12} sm={6}>
                  <BlogPostCard post={post} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Blog'da Ara
              </Typography>
              <SearchBar onSearch={handleSearch} />
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage; 