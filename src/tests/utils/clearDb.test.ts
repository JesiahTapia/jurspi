import { setupMongoDb, teardownMongoDb, clearMongoDb } from '@/tests/utils/testUtils';

describe('Clear Database', () => {
  it('should clear test database', async () => {
    await setupMongoDb();
    await clearMongoDb();
    await teardownMongoDb();
  });
}); 