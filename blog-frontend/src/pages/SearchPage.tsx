import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';
import { BlogPost } from '../types/blog';
import { searchPosts } from '../services/blogService';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const results = await searchPosts(query);
        setPosts(results);
      } catch (error) {
        console.error('Arama hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  const handlePostClick = (postId: number) => {
    navigate(`/blog/${postId}`);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        "{query}" için arama sonuçları
      </Typography>
      
      {loading ? (
        <Typography>Aranıyor...</Typography>
      ) : posts.length > 0 ? (
        <Grid container spacing={4}>
          {posts.map(post => (
            <Grid item xs={12} md={6} key={post.id}>
              <Card 
                onClick={() => handlePostClick(post.id)}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[4]
                  }
                }}
              >
                {post.imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.imageUrl}
                    alt={post.title}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.summary}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.date).toLocaleDateString('tr-TR')} - {post.author.name}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>Sonuç bulunamadı.</Typography>
      )}
    </Container>
  );
};

export default SearchPage; 