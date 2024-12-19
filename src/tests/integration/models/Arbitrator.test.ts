import mongoose from 'mongoose';
import Arbitrator from '@/lib/models/Arbitrator';
import { setupTestDB, closeTestDB, clearTestDB, createTestUser } from '@/tests/api/setup';

describe('Arbitrator Model', () => {
  beforeAll(async () => await setupTestDB());
  afterAll(async () => await closeTestDB());
  beforeEach(async () => await clearTestDB());

  it('should create an arbitrator with valid data', async () => {
    const user = await createTestUser();
    const arbitratorData = {
      userId: user._id,
      specializations: ['Contract Law', 'International Trade'],
      qualifications: [{
        title: 'Bar License',
        issuer: 'NY State Bar',
        dateObtained: new Date('2020-01-01')
      }],
      experience: {
        yearsOfPractice: 5,
        totalCases: 0
      }
    };

    const arbitrator = await Arbitrator.create(arbitratorData);
    expect(arbitrator.specializations).toHaveLength(2);
    expect(arbitrator.status).toBe('ACTIVE');
    expect(arbitrator.availability).toBe(true);
  });

  it('should enforce required fields', async () => {
    const invalidData = {
      specializations: ['Contract Law']
    };
    await expect(Arbitrator.create(invalidData)).rejects.toThrow();
  });

  it('should validate rating range', async () => {
    const user = await createTestUser();
    const invalidRating = {
      userId: user._id,
      specializations: ['Contract Law'],
      rating: 6,
      experience: {
        yearsOfPractice: 5
      }
    };
    await expect(Arbitrator.create(invalidRating)).rejects.toThrow();
  });

  it('should validate experience data', async () => {
    const user = await createTestUser();
    const invalidExperience = {
      userId: user._id,
      specializations: ['Contract Law'],
      experience: {
        yearsOfPractice: -1
      }
    };
    await expect(Arbitrator.create(invalidExperience)).rejects.toThrow();
  });
}); 