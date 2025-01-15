import { setupMongoDb, teardownMongoDb, clearMongoDb } from '../utils/testUtils';
import { Case } from '@/models/Case';
import mongoose from 'mongoose';
import { createTestUser } from '../utils/testUtils';

describe('Ticket #2: Schema Design', () => {
  beforeAll(async () => {
    await setupMongoDb();
  });

  afterAll(async () => {
    await teardownMongoDb();
  });

  afterEach(async () => {
    await clearMongoDb();
  });

  it('should create a case with required fields', async () => {
    const caseData = {
      caseNumber: 'ARB-2024-001',
      status: 'FILED',
      userId: new mongoose.Types.ObjectId(),
      claimant: new mongoose.Types.ObjectId(),
      dispute: {
        description: 'Contract breach',
        amount: 50000,
        category: 'CONTRACT'
      },
      contract: {
        title: 'Service Agreement',
        fileUrl: 'https://example.com/contract.pdf',
        clauses: [{ number: 1, text: 'Service terms' }]
      },
      claimDetails: {
        description: 'Failed to deliver services',
        amount: 50000,
        breachedClauses: [1],
        supportingEvidence: []
      }
    };

    const newCase = await Case.create(caseData);
    expect(newCase.caseNumber).toBe(caseData.caseNumber);
    expect(newCase.status).toBe(caseData.status);
  });

  it('should validate required fields', async () => {
    const invalidCase = new Case({});
    await expect(invalidCase.validate()).rejects.toThrow();
  });

  it('should enforce enum values', async () => {
    const invalidStatus = {
      caseNumber: 'ARB-2024-002',
      status: 'INVALID_STATUS',
      dispute: {
        description: 'Test',
        amount: 1000,
        category: 'CONTRACT'
      }
    };

    await expect(Case.create(invalidStatus)).rejects.toThrow();
  });

  it('should handle nested documents', async () => {
    const user = await createTestUser();
    const caseWithParty = {
      caseNumber: 'ARB-2024-003',
      status: 'FILED',
      userId: new mongoose.Types.ObjectId(),
      claimant: user._id,
      dispute: {
        description: 'Contract breach',
        amount: 50000,
        category: 'CONTRACT'
      },
      contract: {
        title: 'Service Agreement',
        fileUrl: 'https://example.com/contract.pdf',
        clauses: [
          { number: 1, text: 'Service terms' },
          { number: 2, text: 'Payment terms' }
        ]
      },
      claimDetails: {
        description: 'Failed to deliver services',
        amount: 50000,
        breachedClauses: [1],
        supportingEvidence: []
      }
    };

    const newCase = await Case.create(caseWithParty);
    expect(newCase.contract.clauses).toHaveLength(2);
    expect(newCase.contract.clauses[0].text).toBe('Service terms');
    expect(newCase.contract.clauses[1].text).toBe('Payment terms');
  });
}); 