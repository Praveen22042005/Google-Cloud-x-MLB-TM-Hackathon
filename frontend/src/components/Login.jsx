import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container } from '@material-ui/core';
import { useAuth } from '../context/AuthContext';

const LoginUser = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const history = useHistory();
  const { performLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await performLogin(form.email, form.password);
      history.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          {error && (
            <Typography color="error" variant="body2" gutterBottom>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '20px' }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginUser;