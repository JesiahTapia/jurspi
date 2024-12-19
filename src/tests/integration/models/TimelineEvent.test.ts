import mongoose from 'mongoose';
import TimelineEvent from '@/lib/models/TimelineEvent';
import { setupTestDB, closeTestDB, clearTestDB, createTestUser, createTestCase } from '@/tests/api/setup';

describe('TimelineEvent Model', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('should create a timeline event with valid data', async () => {
    const user = await createTestUser();
    const case_ = await createTestCase(user._id.toString());
    
    const eventData = {
      type: 'CASE_FILED',
      description: 'New case filed',
      createdBy: user._id,
      caseId: case_._id
    };

    const event = await TimelineEvent.create(eventData);
    expect(event.type).toBe('CASE_FILED');
    expect(event.description).toBe('New case filed');
  });

  it('should require mandatory fields', async () => {
    const invalidEvent = {
      description: 'Missing type'
    };

    await expect(TimelineEvent.create(invalidEvent)).rejects.toThrow();
  });
}); 