import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Container, Chip, Divider } from '@mui/material';
import { CalendarToday, Person } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchPosts } from '../store/slices/blogSlice';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { posts } = useAppSelector(state => state.blog);
  const post = posts.find(p => p.id === Number(id));

  useEffect(() => {
    if (!posts.length) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length]);

  if (!post) {
    return <Typography>Yazı bulunamadı...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3, color: 'text.secondary' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person fontSize="small" />
            <Typography variant="body2">{post.author.name}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday fontSize="small" />
            <Typography variant="body2">
              {new Date(post.date).toLocaleDateString('tr-TR')}
            </Typography>
          </Box>
          <Chip label={post.category} size="small" />
        </Box>

        <Box 
          component="img"
          src={post.imageUrl}
          alt={post.title}
          sx={{
            width: '100%',
            height: 400,
            objectFit: 'cover',
            borderRadius: 1,
            mb: 4
          }}
        />

        <Divider sx={{ mb: 4 }} />

        {post.content.split('\n\n').map((paragraph, index) => (
          <Typography 
            key={index} 
            paragraph 
            sx={{ 
              textAlign: 'justify',
              lineHeight: 1.8
            }}
          >
            {paragraph}
          </Typography>
        ))}
      </Box>
    </Container>
  );
};

export default BlogPost; 