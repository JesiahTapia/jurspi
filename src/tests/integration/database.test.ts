import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

describe('Database Connection', () => {
  afterEach(async () => {
    await mongoose.disconnect();
  });

  it('handles connection errors', async () => {
    const originalUri = process.env.MONGODB_URI;
    process.env.MONGODB_URI = 'mongodb://nonexistent:27017/test';
    try {
      await connectToDatabase();
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
    }
    process.env.MONGODB_URI = originalUri;
  });
}); 