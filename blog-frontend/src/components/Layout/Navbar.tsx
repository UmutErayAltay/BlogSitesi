import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Blog Sitesi
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Ana Sayfa
          </Button>
          <Button color="inherit" component={RouterLink} to="/categories">
            Kategoriler
          </Button>
          <Button color="inherit" component={RouterLink} to="/about">
            Hakkında
          </Button>
          {isAuthenticated && user?.role === 'admin' && (
            <Button color="inherit" component={RouterLink} to="/admin">
              Admin Panel
            </Button>
          )}
          {isAuthenticated ? (
            <Button color="inherit" onClick={() => dispatch(logout())}>
              Çıkış Yap
            </Button>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Giriş Yap
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 