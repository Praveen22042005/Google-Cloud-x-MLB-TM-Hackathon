const express = require('express');
const router = express.Router();
const Highlight = require('../models/Highlight');

// Advanced Search
router.get('/', async (req, res) => {
  try {
    const { player, playType, date, team } = req.query;
    let query = {};

    if (player) {
      query.players = { $in: [player] };
    }

    if (playType) {
      query.playType = playType;
    }

    if (team) {
      query.teams = { $in: [team] };
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.createdAt = { $gte: start, $lt: end };
    }

    const highlights = await Highlight.find(query)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.json(highlights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;