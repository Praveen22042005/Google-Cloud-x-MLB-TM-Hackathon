const { SpeechClient } = require('@google-cloud/speech');
const config = require('../config');

class SpeechService {
  constructor() {
    this.client = new SpeechClient({
      projectId: config.gcpProjectId,
      keyFilename: config.googleApplicationCredentials
    });
  }

  async transcribeAudio(gcsUri) {
    try {
      const request = {
        audio: { 
          uri: gcsUri 
        },
        config: {
          encoding: 'MP3',
          sampleRateHertz: 44100,
          languageCode: 'en-US',
          enableAutomaticPunctuation: true,
          model: 'default'
        }
      };

      console.log('Starting transcription...');
      const operation = await this.client.longRunningRecognize(request);
      console.log('Waiting for transcription to complete...');
      
      const [response] = await operation[0].promise();
      
      if (!response || !response.results || response.results.length === 0) {
        throw new Error('No transcription results found');
      }

      const transcript = response.results
        .map(result => result.alternatives[0].transcript)
        .join(' ');

      console.log('Transcription completed:', transcript.substring(0, 100) + '...');
      return transcript;

    } catch (error) {
      console.error('Speech-to-Text Error:', error);
      throw new Error('Failed to transcribe audio: ' + error.message);
    }
  }
}

module.exports = new SpeechService();