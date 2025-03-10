const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Highlight = require('../models/Highlight');
const User = require('../models/User');
const auth = require('../middleware/auth'); // Added auth

// Add Comment to Highlight
router.post('/comments', auth, async (req, res) => {
  try {
    const { highlightId, content } = req.body;
    const userId = req.user._id; // From auth middleware

    const highlight = await Highlight.findById(highlightId);
    if (!highlight) return res.status(404).json({ error: 'Highlight not found' });

    const comment = new Comment({
      highlight: highlightId,
      user: userId,
      content
    });
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Comments for a Highlight
router.get('/comments/:highlightId', auth, async (req, res) => { // Protected
  try {
    const comments = await Comment.find({ highlight: req.params.highlightId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Share Highlight (Generates a Shareable Link)
router.post('/share', auth, async (req, res) => { // Protected
  try {
    const { highlightId } = req.body;
    const highlight = await Highlight.findById(highlightId);
    if (!highlight) return res.status(404).json({ error: 'Highlight not found' });

    const shareableLink = `${process.env.FRONTEND_URL}/highlights/${highlightId}`;
    res.json({ shareableLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;