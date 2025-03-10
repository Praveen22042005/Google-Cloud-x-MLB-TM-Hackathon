const { Storage } = require('@google-cloud/storage');
const path = require('path');
const config = require('../config');

const storage = new Storage({
  projectId: config.gcpProjectId,
  keyFilename: config.googleApplicationCredentials
});

const bucket = storage.bucket(config.gcpBucketName);

/**
 * Uploads a file to Google Cloud Storage.
 * @param {string} filePath - Local path of the file to upload.
 * @param {string} destFileName - Destination file name in GCS.
 * @returns {string} - GCS URI of the uploaded file.
 */
async function uploadFile(filePath, destFileName) {
  try {
    await bucket.upload(filePath, {
      destination: destFileName,
      resumable: false,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });
    const gcsUri = `gs://${config.gcpBucketName}/${destFileName}`;
    console.log(`File uploaded to ${gcsUri}`);
    return gcsUri;
  } catch (error) {
    console.error('Error uploading file to GCS:', error);
    throw error;
  }
}

module.exports = { uploadFile };