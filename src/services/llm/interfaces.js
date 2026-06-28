export class LLMProvider {
  async analyze(prompt, imageBase64) {
    throw new Error('Not implemented');
  }

  async chatStream(messages, onChunk) {
    throw new Error('Not implemented');
  }

  getSupportedModels() {
    throw new Error('Not implemented');
  }
}
