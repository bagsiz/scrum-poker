import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Button, 
  Container, 
  Typography, 
  Box, 
  Alert,
  Avatar,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { signInWithGoogle, currentUser, logout } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError('');
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to sign in. Make sure you use a corporate email.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to log out.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Scrum Points App
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}

        {currentUser ? (
          <Paper elevation={3} sx={{ p: 3, width: '100%', mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={currentUser.photoURL} 
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">{currentUser.displayName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {currentUser.email}
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handleLogout}
              sx={{ mt: 2 }}
            >
              Sign Out
            </Button>
          </Paper>
        ) : (
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In with Google
          </Button>
        )}
      </Box>
    </Container>
  );
} 