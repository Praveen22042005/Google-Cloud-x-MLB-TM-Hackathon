const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Highlight = require('../models/Highlight');
const User = require('../models/User');
const gcpUtils = require('../utils/gcpUtils');
const videoAI = require('../models/videoAI');
const nlp = require('../models/nlp');
const speech = require('../models/speech');
const auth = require('../middleware/auth'); // Added auth middleware

const processStatus = new Map();

// Upload a Highlight Video
router.post('/upload', auth, upload.single('video'), async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id; // From auth middleware

    // Upload to Google Cloud Storage
    const gcsUri = await gcpUtils.uploadFile(file.path, `videos/${Date.now()}-${file.originalname}`);

    // Create Highlight Entry
    const highlight = new Highlight({
      title: file.originalname,
      gcsUri,
      status: 'uploading',
      progress: 0,
      createdBy: userId
    });
    await highlight.save();

    // Start Processing the Video
    processVideo(gcsUri, highlight._id, req.user.preferences.language);

    res.status(201).json({ message: 'Highlight uploaded and processing started', highlightId: highlight._id });
  } catch (error) {
    console.error('Error uploading highlight:', error);
    res.status(500).json({ error: 'Failed to upload highlight' });
  }
});

// Get User's Highlights
router.get('/', auth, async (req, res) => {
  try {
    const highlights = await Highlight.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json(highlights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch highlights' });
  }
});

async function processVideo(gcsUri, highlightId, language) {
    try {
      // Update status to analyzing
      await Highlight.findByIdAndUpdate(highlightId, { 
        status: 'analyzing', 
        progress: 30 
      });
  
      // Start parallel processing
      const [videoAnalysis, transcript] = await Promise.all([
        videoAI.analyzeVideo(gcsUri),
        speech.transcribeAudio(gcsUri, language)
      ]);
  
      // Update progress
      await Highlight.findByIdAndUpdate(highlightId, { progress: 60 });
  
      // Analyze sentiment
      const sentimentAnalysis = await nlp.analyzeSentiment(transcript);
      const sentimentScore = sentimentAnalysis.documentSentiment.score;
  
      // Update Highlight with final results
      await Highlight.findByIdAndUpdate(highlightId, {
        status: 'completed',
        progress: 100,
        transcript,
        sentimentScore,
        keyMoments: videoAnalysis.keyMoments,
        playType: videoAnalysis.playType,
        teams: videoAnalysis.teams,
        players: videoAnalysis.players
      });
  
      console.log('Video processing completed successfully');
  
    } catch (error) {
      console.error('Error processing video:', error);
      await Highlight.findByIdAndUpdate(highlightId, {
        status: 'error',
        progress: 0,
        error: error.message
      });
    }
  }

// Get Status of a Highlight
router.get('/status/:highlightId', auth, async (req, res) => { // Protected
    try {
      const { highlightId } = req.params;
      const highlight = await Highlight.findById(highlightId)
        .select('status progress error transcript sentimentScore keyMoments');
      
      if (!highlight) {
        return res.status(404).json({ error: 'Highlight not found' });
      }
  
      res.json({
        status: highlight.status,
        progress: highlight.progress,
        error: highlight.error || null,
        transcript: highlight.transcript,
        sentimentScore: highlight.sentimentScore,
        keyMoments: highlight.keyMoments
      });
    } catch (error) {
      console.error('Error fetching highlight status:', error);
      res.status(500).json({ error: 'Failed to fetch highlight status' });
    }
  });

module.exports = router;