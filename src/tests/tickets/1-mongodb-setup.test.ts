import { connectToDatabase, disconnectFromDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { setupMongoDb, teardownMongoDb, clearMongoDb } from '../utils/testUtils';
import { Case } from '@/models/Case';

describe('Ticket #1: MongoDB Setup', () => {
  afterEach(async () => {
    await disconnectFromDatabase();
  });

  it('should connect to database with valid URI', async () => {
    const conn = await connectToDatabase();
    expect(conn.readyState).toBe(1);
  });

  it('should throw error when MONGODB_URI is not defined', async () => {
    const originalUri = process.env.MONGODB_URI;
    delete process.env.MONGODB_URI;
    
    await expect(connectToDatabase()).rejects.toThrow(
      'MONGODB_URI environment variable is not defined'
    );
    
    process.env.MONGODB_URI = originalUri;
  });

  it('should reuse existing connection', async () => {
    const conn1 = await connectToDatabase();
    const conn2 = await connectToDatabase();
    expect(conn1.id).toBe(conn2.id);
  });

  it('should handle connection errors', async () => {
    const originalUri = process.env.MONGODB_URI;
    process.env.MONGODB_URI = 'mongodb://nonexistent:27017/test';
    
    await expect(connectToDatabase()).rejects.toThrow();
    
    process.env.MONGODB_URI = originalUri;
  });
}); 