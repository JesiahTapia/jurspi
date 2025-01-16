import { connectToDatabase } from '@/lib/db';
import { setupMongoDb, teardownMongoDb, clearMongoDb } from '@/tests/utils/testUtils';

describe('MongoDB Connection Pooling', () => {
  beforeAll(async () => {
    await setupMongoDb();
  });

  afterAll(async () => {
    await teardownMongoDb();
  });

  beforeEach(async () => {
    await clearMongoDb();
  });

  it('should reuse existing connections', async () => {
    const conn1 = await connectToDatabase();
    const conn2 = await connectToDatabase();
    expect(conn1).toBe(conn2);
  });

  it('should handle concurrent connections', async () => {
    const connections = await Promise.all([
      connectToDatabase(),
      connectToDatabase(),
      connectToDatabase()
    ]);
    
    const uniqueConnections = new Set(connections);
    expect(uniqueConnections.size).toBe(1);
  });

  it('should maintain connection across requests', async () => {
    const conn1 = await connectToDatabase();
    await teardownMongoDb();
    const conn2 = await connectToDatabase();
    expect(conn2.readyState).toBe(1);
  });
}); 