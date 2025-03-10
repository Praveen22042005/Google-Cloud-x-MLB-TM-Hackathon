import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { 
  Select, 
  MenuItem, 
  Button,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Typography,
  Container
} from '@material-ui/core';
import { useAuth } from '../context/AuthContext';

const UserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    teams: [],
    players: [],
    language: 'en-US',
    notificationFrequency: 'daily',
    highlightTypes: []
  });
  
  const [availableTeams] = useState(['Yankees', 'Red Sox', 'Dodgers', 'Cubs']);
  const [availablePlayers] = useState(['Player1', 'Player2', 'Player3']); // Example players
  const [availableLanguages] = useState(['en-US', 'es-ES', 'fr-FR']);
  const [notificationFrequencies] = useState(['daily', 'weekly', 'monthly']);
  const [availableHighlightTypes] = useState(['Goals', 'Assists', 'Saves']); // Example types
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.id) {
      axios.get(`/users/me/preferences`)
        .then(response => setPreferences(response.data))
        .catch(error => console.error('Error fetching preferences:', error));
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`/users/me/preferences`, preferences);
      setMessage('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage('Failed to save preferences.');
    }
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>User Preferences</Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Teams</InputLabel>
          <Select
            multiple
            name="teams"
            value={preferences.teams}
            onChange={handleChange}
            renderValue={(selected) => (
              <Box display="flex" flexWrap="wrap">
                {selected.map((value) => (
                  <Chip key={value} label={value} style={{ margin: 2 }} />
                ))}
              </Box>
            )}
          >
            {availableTeams.map((team) => (
              <MenuItem key={team} value={team}>
                {team}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Players</InputLabel>
          <Select
            multiple
            name="players"
            value={preferences.players}
            onChange={handleChange}
            renderValue={(selected) => (
              <Box display="flex" flexWrap="wrap">
                {selected.map((value) => (
                  <Chip key={value} label={value} style={{ margin: 2 }} />
                ))}
              </Box>
            )}
          >
            {availablePlayers.map((player) => (
              <MenuItem key={player} value={player}>
                {player}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Language</InputLabel>
          <Select
            name="language"
            value={preferences.language}
            onChange={handleChange}
          >
            {availableLanguages.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Notification Frequency</InputLabel>
          <Select
            name="notificationFrequency"
            value={preferences.notificationFrequency}
            onChange={handleChange}
          >
            {notificationFrequencies.map((freq) => (
              <MenuItem key={freq} value={freq}>
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Highlight Types</InputLabel>
          <Select
            multiple
            name="highlightTypes"
            value={preferences.highlightTypes}
            onChange={handleChange}
            renderValue={(selected) => (
              <Box display="flex" flexWrap="wrap">
                {selected.map((value) => (
                  <Chip key={value} label={value} style={{ margin: 2 }} />
                ))}
              </Box>
            )}
          >
            {availableHighlightTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Preferences
          </Button>
        </Box>
        
        {message && (
          <Box mt={2}>
            <Typography variant="body1" color={message.includes('success') ? 'primary' : 'error'}>
              {message}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default UserPreferences;