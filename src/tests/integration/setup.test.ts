import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

describe('MongoDB Connection', () => {
  it('should connect successfully', async () => {
    const conn = await connectToDatabase();
    expect(conn.readyState).toBe(1);
  });

  it('should use test database', async () => {
    const conn = await connectToDatabase();
    expect(conn.name).toContain('test');
  }, 60000);
}); 