import axios from 'axios';

export class VirusScanService {
  private static readonly API_KEY = process.env.VIRUS_SCAN_API_KEY;
  private static readonly API_URL = 'https://api.virusscan.example.com/scan';

  static async scanBuffer(buffer: Buffer): Promise<boolean> {
    if (process.env.NODE_ENV === 'test') {
      return true; // Mock response for tests
    }

    try {
      const response = await axios.post(
        this.API_URL,
        { file: buffer.toString('base64') },
        { headers: { 'X-API-Key': this.API_KEY } }
      );
      return response.data.safe === true;
    } catch (error) {
      console.error('Virus scan error:', error);
      throw new Error('File failed virus scan');
    }
  }
} 