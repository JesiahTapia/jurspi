import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

describe('MongoDB Connection', () => {
  afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('should handle connection errors', async () => {
    const originalUri = process.env.MONGODB_URI;
    process.env.MONGODB_URI = 'mongodb://invalid:27017/test';
    
    try {
      await connectToDatabase();
      fail('Expected connection to fail');
    } catch (error) {
      expect(error).toBeDefined();
    } finally {
      process.env.MONGODB_URI = originalUri;
    }
  });
}); 