const mongoose = require('mongoose');

const highlightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  gcsUri: { type: String, required: true },
  transcript: { type: String, default: 'Processing transcript...' },
  sentimentScore: { 
    type: Number,
    min: -1,
    max: 1,
    default: 0
  },
  keyMoments: [{ 
    type: String,
    default: []
  }],
  playType: { 
    type: String, 
    enum: ['home_run', 'pitching', 'catch', 'other'],
    default: 'other'
  },
  teams: [{ type: String }],
  players: [{ type: String }],
  status: { 
    type: String, 
    enum: ['uploading', 'analyzing', 'completed', 'error'], 
    default: 'uploading' 
  },
  progress: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100 
  },
  error: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Highlight', highlightSchema);