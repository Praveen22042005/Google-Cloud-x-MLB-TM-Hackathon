const { VideoIntelligenceServiceClient } = require('@google-cloud/video-intelligence');
const config = require('../config');

class VideoAIService {
  constructor() {
    this.client = new VideoIntelligenceServiceClient({
      projectId: config.gcpProjectId,
      keyFilename: config.googleApplicationCredentials
    });
  }

  async analyzeVideo(gcsUri) {
    try {
      const request = {
        inputUri: gcsUri,
        features: [
          'LABEL_DETECTION',
          'SHOT_CHANGE_DETECTION',
          'SPEECH_TRANSCRIPTION'
        ],
        videoContext: {
          speechTranscriptionConfig: {
            languageCode: 'en-US',
            enableAutomaticPunctuation: true,
          },
        },
      };

      console.log('Starting video analysis...');
      const [operation] = await this.client.annotateVideo(request);
      console.log('Waiting for video analysis to complete...');
      
      const [result] = await operation.promise();

      // Extract key moments from labels
      const keyMoments = result.labelAnnotations
        ? result.labelAnnotations
            .filter(label => label.frames.length > 0)
            .map(label => label.entity.description)
        : [];

      // Extract play type based on labels
      const playTypes = new Set(['home_run', 'pitching', 'catch']);
      const detectedPlayType = keyMoments.find(moment => playTypes.has(moment.toLowerCase())) || 'other';

      return {
        keyMoments,
        playType: detectedPlayType,
        teams: [], // Add team detection logic if needed
        players: [] // Add player detection logic if needed
      };

    } catch (error) {
      console.error('Video Analysis Error:', error);
      throw new Error('Failed to analyze video: ' + error.message);
    }
  }
}

module.exports = new VideoAIService();