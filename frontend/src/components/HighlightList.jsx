import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { 
  CircularProgress, 
  Button, 
  Card, 
  CardContent, 
  Typography,
  LinearProgress,
  Box,
  Container,
  Grid
} from '@material-ui/core';
import { useAuth } from '../context/AuthContext'; // Added
import './HighlightList.css';

const HighlightList = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null); // Renamed to differentiate
  const history = useHistory();
  const { user } = useAuth(); // Added

  // Fetch User's Highlights
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/highlights'); // Fetch highlights for the authenticated user
        setHighlights(response.data.map(h => ({
          id: h._id,
          title: h.title,
          status: h.status,
          progress: h.progress,
          transcript: h.transcript,
          sentimentScore: h.sentimentScore,
          keyMoments: h.keyMoments
        })));
      } catch (error) {
        console.error('Error fetching highlights:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHighlights();
    }
  }, [user]);

  // Poll for Status Updates
  useEffect(() => {
    const pollStatus = async () => {
      if (!user) return;

      const updatedHighlights = await Promise.all(
        highlights.map(async highlight => {
          if (highlight.status !== 'completed' && highlight.status !== 'error') {
            try {
              const response = await axios.get(`/highlights/status/${highlight.id}`);
              return { ...highlight, ...response.data };
            } catch (error) {
              return { 
                ...highlight, 
                status: 'error', 
                error: error.message 
              };
            }
          }
          return highlight;
        })
      );
      setHighlights(updatedHighlights);
    };

    const interval = setInterval(pollStatus, 5000);
    return () => clearInterval(interval);
  }, [highlights, user]);

  const handleFileUpload = async (event) => {
    if (!user) {
      if (window.confirm('You need to register first. Would you like to register now?')) {
        history.push('/register');
      }
      return;
    }

    try {
      setLoading(true);
      setUploadError(null); // Reset upload error
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('video', file);
      // No need to append userId, backend uses auth

      const response = await axios.post(
        '/highlights/upload', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const newHighlight = {
        id: response.data.highlightId, // Ensure correct field
        title: file.originalname,
        status: 'processing', // Set initial status
        progress: 0,
        transcript: '',
        sentimentScore: 0,
        keyMoments: []
      };

      setHighlights(prev => [...prev, newHighlight]);
    } catch (error) {
      setUploadError('Failed to upload video: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const renderProgress = (highlight) => {
    if (highlight.status === 'completed' || highlight.status === 'error') return null;
    return (
      <div className="progress-indicator">
        <LinearProgress 
          variant="determinate" 
          value={highlight.progress || 0} 
          color="secondary"
        />
        <Typography variant="caption" color="textSecondary">
          {highlight.status.replace('_', ' ')}... ({highlight.progress || 0}%)
        </Typography>
      </div>
    );
  };

  const renderError = (highlight) => {
    if (highlight.status === 'error') {
      return (
        <Typography
          color="error"
          className="error-details"
        >
          Error: {highlight.error || 'An error occurred during processing'}
        </Typography>
      );
    }
    return null;
  };

  const renderAnalysis = (highlight) => {
    return (
      <div className="analysis-section">
        <Typography variant="h6" gutterBottom>
          Analysis
        </Typography>
        
        <Typography variant="subtitle1" color="textSecondary">
          Status: {highlight.status.replace('_', ' ')}
        </Typography>
        
        {renderError(highlight)}
        {renderProgress(highlight)}

        {highlight.status === 'completed' && (
          <>
            <Typography variant="body1" paragraph>
              Transcript: {highlight.transcript}
            </Typography>

            <Typography variant="body1" paragraph>
              Sentiment Score: {highlight.sentimentScore.toFixed(2)}
            </Typography>

            <Typography variant="body1">
              Key Moments: {
                highlight.keyMoments.length > 0
                  ? highlight.keyMoments.join(', ')
                  : 'No moments detected.'
              }
            </Typography>
          </>
        )}
      </div>
    );
  };

  return (
    <Container className="highlights-container">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Baseball Game Highlights</Typography>
        {!user && (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/register"
          >
            Register to Upload
          </Button>
        )}
      </Box>
      
      <div className="upload-section">
        <input
          accept="video/*"
          id="video-upload"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
          disabled={loading}
        />
        <label htmlFor="video-upload">
          <Button
            variant="contained"
            color="primary"
            component="span"
            disabled={loading}
          >
            Upload Video
          </Button>
        </label>
        {loading && <CircularProgress size={24} className="progress" />}
        {uploadError && (
          <Typography color="error" className="error-message">
            {uploadError}
          </Typography>
        )}
      </div>

      <Grid container spacing={3}>
        {highlights.map(highlight => (
          <Grid item xs={12} sm={6} md={4} key={highlight.id}>
            <Card className="highlight-card">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Link to={`/highlights/${highlight.id}`}>
                    {highlight.title}
                  </Link>
                </Typography>
                {renderAnalysis(highlight)}
              </CardContent>
            </Card>
          </Grid>
        ))}
        {highlights.length === 0 && (
          <Typography variant="body1" color="textSecondary" align="center">
            No highlights uploaded yet. Upload a video to get started.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default HighlightList;