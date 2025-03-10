require('dotenv').config();

const config = {
  gcpProjectId: process.env.GCP_PROJECT_ID,
  gcpBucketName: process.env.GCP_BUCKET_NAME,
  videoAiLocation: process.env.VIDEO_AI_LOCATION,
  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS
};

// Verify configuration
console.log('Loading configuration:', {
  projectId: config.gcpProjectId,
  bucketName: config.gcpBucketName,
  location: config.videoAiLocation
});

module.exports = config;