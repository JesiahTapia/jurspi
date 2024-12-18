import mongoose from 'mongoose';
import Party from '@/lib/models/Party';
import { setupTestDB, closeTestDB, clearTestDB, createTestUser } from '@/tests/api/setup';

describe('Party Model', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('should create a party with valid data', async () => {
    const user = await createTestUser();
    const partyData = {
      type: 'CLAIMANT',
      userId: user._id,
      contactDetails: {
        email: 'test@example.com'
      }
    };

    const party = await Party.create(partyData);
    expect(party.type).toBe('CLAIMANT');
    expect(party.contactDetails.email).toBe('test@example.com');
  });

  it('should require type field', async () => {
    const user = await createTestUser();
    const invalidParty = {
      userId: user._id,
      contactDetails: {
        email: 'test@example.com'
      }
    };

    await expect(Party.create(invalidParty)).rejects.toThrow();
  });
}); www