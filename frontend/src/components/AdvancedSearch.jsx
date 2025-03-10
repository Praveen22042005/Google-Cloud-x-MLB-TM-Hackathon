import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import { 
  TextField, 
  Select, 
  MenuItem, 
  Button,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import './AdvancedSearch.css';

const AdvancedSearch = () => {
  const [searchParams, setSearchParams] = useState({
    player: '',
    playType: '',
    date: '',
    team: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setSearchParams({
      ...searchParams,
      [field]: value
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/search', { params: searchParams });
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to perform search.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="advanced-search-container">
      <Typography variant="h5" gutterBottom>Advanced Search</Typography>
      <Box display="flex" flexDirection="column" gap={2} maxWidth="600px" mb={4}>
        <TextField
          label="Player"
          value={searchParams.player}
          onChange={(e) => handleChange('player', e.target.value)}
        />
        <FormControl>
          <InputLabel>Play Type</InputLabel>
          <Select
            value={searchParams.playType}
            onChange={(e) => handleChange('playType', e.target.value)}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="home_run">Home Run</MenuItem>
            <MenuItem value="pitching">Pitching</MenuItem>
            <MenuItem value="catch">Catch</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={searchParams.date}
          onChange={(e) => handleChange('date', e.target.value)}
        />
        <FormControl>
          <InputLabel>Team</InputLabel>
          <Select
            value={searchParams.team}
            onChange={(e) => handleChange('team', e.target.value)}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="Yankees">Yankees</MenuItem>
            <MenuItem value="Red Sox">Red Sox</MenuItem>
            <MenuItem value="Dodgers">Dodgers</MenuItem>
            <MenuItem value="Cubs">Cubs</MenuItem>
          </Select>
        </FormControl>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>

      <Box mt={4}>
        <Typography variant="h6">Results</Typography>
        {loading ? (
          <CircularProgress />
        ) : results.length > 0 ? (
          <Grid container spacing={3}>
            {results.map(highlight => (
              <Grid item xs={12} sm={6} md={4} key={highlight._id}>
                <Card className="highlight-card">
                  <CardContent>
                    <Typography variant="h6">
                      <Link to={`/highlights/${highlight._id}`}>
                        {highlight.title}
                      </Link>
                    </Typography>
                    <Box mt={1}>
                      <Chip label={`Play Type: ${highlight.playType.replace('_', ' ')}`} style={{ marginRight: '5px' }} />
                      <Chip label={`Team: ${highlight.teams.join(', ')}`} style={{ marginRight: '5px' }} />
                      <Chip label={`Date: ${new Date(highlight.createdAt).toLocaleDateString()}`} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No results found.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default AdvancedSearch;