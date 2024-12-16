import mongoose from 'mongoose';
import { Case } from '@/lib/models/Case';

describe('Case API Integration Tests', () => {
  it('should create a new case', async () => {
    const caseData = new Case({
      title: 'Test Case',
      description: 'Test Description',
      claimantId: 'test-user-id',
      status: 'PENDING'
    });

    const savedCase = await caseData.save();
    expect(savedCase._id).toBeDefined();
    expect(savedCase.title).toBe('Test Case');
    expect(savedCase.status).toBe('PENDING');
  });
}); 