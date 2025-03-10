import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box
} from '@material-ui/core';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axiosConfig';

const UserProfile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    email: user.email,
    username: user.username
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/users/${user._id}`, formData);
      login(response.data);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile: ' + error.response?.data?.error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              User Profile
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: '20px' }}
              >
                Update Profile
              </Button>
            </form>
            {message && (
              <Typography
                color={message.includes('Failed') ? 'error' : 'primary'}
                style={{ marginTop: '10px' }}
              >
                {message}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default UserProfile;