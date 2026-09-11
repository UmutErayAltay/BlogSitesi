import React from 'react';
import { Chip, Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  count: number;
}

const categories: Category[] = [
  { id: 'teknoloji', name: 'Teknoloji', count: 5 },
  { id: 'yazilim', name: 'Yazılım', count: 3 },
  { id: 'tasarim', name: 'Tasarım', count: 2 },
];

const CategoryList: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Kategoriler
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={`${category.name} (${category.count})`}
            component={RouterLink}
            to={`/category/${category.id}`}
            clickable
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
};

export default CategoryList; 