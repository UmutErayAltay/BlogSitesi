import React from 'react';
import { Box, CircularProgress, Container } from '@mui/material';

const Loading: React.FC = () => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    </Container>
  );
};

export default Loading; 