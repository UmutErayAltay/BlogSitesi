import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea 
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchPosts } from '../store/slices/blogSlice';

const CategoriesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts } = useAppSelector(state => state.blog);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  // Benzersiz kategorileri al
  const categories = Array.from(new Set(posts.map(post => post.category)));

  // Her kategori için post sayısını hesapla
  const categoryStats = categories.map(category => ({
    name: category,
    count: posts.filter(post => post.category === category).length
  }));

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Kategoriler
      </Typography>
      <Grid container spacing={3}>
        {categoryStats.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.name}>
            <Card>
              <CardActionArea 
                onClick={() => navigate(`/category/${category.name}`)}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.count} yazı
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoriesPage; 