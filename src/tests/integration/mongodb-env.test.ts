import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

describe('MongoDB Environment Setup', () => {
  beforeEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('should throw error when MONGODB_URI is not defined', async () => {
    const originalUri = process.env.MONGODB_URI;
    delete process.env.MONGODB_URI;
    
    await expect(connectToDatabase()).rejects.toThrow();
    
    process.env.MONGODB_URI = originalUri;
  });

  it('should handle invalid connection strings', async () => {
    const originalUri = process.env.MONGODB_URI;
    process.env.MONGODB_URI = 'invalid-uri';
    
    await expect(connectToDatabase()).rejects.toThrow();
    
    process.env.MONGODB_URI = originalUri;
  });
}); 