import { setupTestDB, closeTestDB, clearTestDB } from '../shared/testSetup';

describe('Clear Database', () => {
  it('should clear test database', async () => {
    await setupTestDB();
    await clearTestDB();
    await closeTestDB();
  });
}); 