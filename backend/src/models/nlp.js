const { LanguageServiceClient } = require('@google-cloud/language');
const config = require('../config');

class NLPService {
  constructor() {
    this.client = new LanguageServiceClient({
      projectId: config.gcpProjectId,
      keyFilename: config.googleApplicationCredentials
    });
  }

  async analyzeSentiment(text) {
    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };
    const [result] = await this.client.analyzeSentiment({ document });
    return result;
  }
}

module.exports = new NLPService();