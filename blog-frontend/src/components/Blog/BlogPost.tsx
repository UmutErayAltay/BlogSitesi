import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { ThumbUp, Visibility, Comment } from '@mui/icons-material';
import { formatDistance } from 'date-fns';
import { tr } from 'date-fns/locale';
import { BlogPost as BlogPostType } from '../../types/blog';

interface Props {
  post: BlogPostType;
  preview?: boolean;
}

const BlogPost: React.FC<Props> = ({ post, preview = false }) => {
  const formattedDate = formatDistance(new Date(post.date), new Date(), {
    addSuffix: true,
    locale: tr
  });

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height={200}
        image={post.imageUrl}
        alt={post.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={post.category} 
            size="small" 
            color="primary" 
            sx={{ mr: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
        </Box>

        <Typography 
          variant="h5" 
          component={Link} 
          to={`/blog/${post.id}`}
          sx={{ 
            textDecoration: 'none', 
            color: 'inherit',
            '&:hover': { color: 'primary.main' }
          }}
          gutterBottom
        >
          {post.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          {post.summary}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mt: 'auto'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Beğeni sayısı">
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <IconButton size="small">
                  <ThumbUp fontSize="small" />
                </IconButton>
                <Typography variant="body2">{post.likes}</Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Görüntülenme sayısı">
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Visibility fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">{post.views}</Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Yorum sayısı">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Comment fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                  {post.comments?.length || 0}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary"
            component={Link}
            to={`/author/${post.author.id}`}
            sx={{ textDecoration: 'none' }}
          >
            {post.author.name}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlogPost; 