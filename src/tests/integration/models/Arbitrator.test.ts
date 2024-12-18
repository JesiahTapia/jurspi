import mongoose from 'mongoose';
import Arbitrator from '@/lib/models/Arbitrator';
import { setupTestDB, closeTestDB, clearTestDB, createTestUser } from '@/tests/api/setup';

describe('Arbitrator Model', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('should create an arbitrator with valid data', async () => {
    const user = await createTestUser();
    const arbitratorData = {
      userId: user._id,
      specializations: ['Contract Law', 'International Trade'],
      availability: true
    };

    const arbitrator = await Arbitrator.create(arbitratorData);
    expect(arbitrator.specializations).toHaveLength(2);
    expect(arbitrator.availability).toBe(true);
  });

  it('should require userId field', async () => {
    const invalidArbitrator = {
      specializations: ['Contract Law'],
      availability: true
    };

    await expect(Arbitrator.create(invalidArbitrator)).rejects.toThrow();
  });

  it('should update cases array', async () => {
    const user = await createTestUser();
    const arbitrator = await Arbitrator.create({
      userId: user._id,
      specializations: ['Contract Law']
    });

    const caseId = new mongoose.Types.ObjectId();
    arbitrator.cases.push(caseId);
    await arbitrator.save();

    const updated = await Arbitrator.findById(arbitrator._id);
    expect(updated?.cases).toHaveLength(1);
  });
}); 