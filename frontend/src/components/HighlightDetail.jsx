import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  TextField, 
  Button,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@material-ui/core';
import './HighlightDetail.css';

const HighlightDetail = () => {
  const { id } = useParams();
  const [highlight, setHighlight] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [shareableLink, setShareableLink] = useState('');

  const fetchHighlight = useCallback(async () => {
    try {
      const response = await axios.get(`/api/highlights/${id}`);
      setHighlight(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching highlight:', error);
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`/api/social/comments/${id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchHighlight();
    fetchComments();
  }, [fetchHighlight, fetchComments]);

  const handleAddComment = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please register to add comments.');
      return;
    }
    if (!commentContent.trim()) return;
    try {
      const response = await axios.post('/api/social/comments', {
        highlightId: id,
        userId,
        content: commentContent
      });
      setComments([response.data, ...comments]);
      setCommentContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment.');
    }
  };

  const handleShare = async () => {
    try {
      const response = await axios.post('/api/social/share', { highlightId: id });
      setShareableLink(response.data.shareableLink);
    } catch (error) {
      console.error('Error sharing highlight:', error);
      alert('Failed to generate shareable link.');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!highlight) {
    return <Typography variant="h6">Highlight not found.</Typography>;
  }

  return (
    <Box p={4} className="highlight-detail-container">
      <Typography variant="h4" gutterBottom>{highlight.title}</Typography>
      
      <video width="100%" controls className="video-player">
        <source src={highlight.gcsUri} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Share Highlight */}
      <Box mt={2}>
        <Button variant="contained" color="secondary" onClick={handleShare}>
          Share Highlight
        </Button>
        {shareableLink && (
          <Box mt={1}>
            <Typography variant="body1">Shareable Link:</Typography>
            <a href={shareableLink} target="_blank" rel="noopener noreferrer">
              {shareableLink}
            </a>
          </Box>
        )}
      </Box>

      <Box mt={4}>
        <Typography variant="h6">Transcript</Typography>
        <Typography variant="body1">{highlight.transcript || 'Transcript not available.'}</Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h6">Sentiment Score</Typography>
        <Typography variant="body1">{highlight.sentimentScore !== undefined ? highlight.sentimentScore.toFixed(2) : 'N/A'}</Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h6">Key Moments</Typography>
        <Box>
          {highlight.keyMoments && highlight.keyMoments.length > 0 ? (
            highlight.keyMoments.map((moment, index) => (
              <Chip key={index} label={moment} style={{ marginRight: '5px', marginBottom: '5px' }} />
            ))
          ) : (
            <Typography variant="body1">No key moments detected.</Typography>
          )}
        </Box>
      </Box>

      <Box mt={4}>
        <Typography variant="h6">Comments</Typography>
        {localStorage.getItem('userId') ? (
          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              label="Add a comment"
              variant="outlined"
              fullWidth
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAddComment}
              style={{ marginLeft: '10px', height: '56px' }}
            >
              Submit
            </Button>
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Please register to add comments.
          </Typography>
        )}
        <List>
          {comments.map(comment => (
            <ListItem key={comment._id} alignItems="flex-start">
              <ListItemText
                primary={comment.user.username}
                secondary={comment.content}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default HighlightDetail;