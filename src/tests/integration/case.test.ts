import mongoose from 'mongoose';
import Case from '@/lib/models/Case';
import { setupTestDB, closeTestDB, clearTestDB, createTestUser } from '@/tests/api/setup';

describe('Case Model', () => {
  beforeAll(async () => await setupTestDB());
  afterAll(async () => await closeTestDB());
  beforeEach(async () => await clearTestDB());

  it('should create a case with valid data', async () => {
    const user = await createTestUser();
    const caseData = {
      caseNumber: 'ARB-2024-001',
      status: 'FILED',
      claimant: {
        type: 'CLAIMANT',
        name: 'John Doe',
        email: 'john@example.com',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
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

    const savedCase = await Case.create(caseData);
    expect(savedCase.caseNumber).toBe('ARB-2024-001');
    expect(savedCase.status).toBe('FILED');
    expect(savedCase.claimant.name).toBe('John Doe');
  });

  it('should enforce required fields', async () => {
    const invalidCase = {
      status: 'FILED'
    };

    await expect(Case.create(invalidCase)).rejects.toThrow();
  });

  it('should validate status enum values', async () => {
    const user = await createTestUser();
    const invalidStatus = {
      caseNumber: 'ARB-2024-002',
      status: 'INVALID_STATUS',
      claimant: {
        type: 'CLAIMANT',
        name: 'John Doe',
        email: 'john@example.com',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      }
    };

    await expect(Case.create(invalidStatus)).rejects.toThrow();
  });
}); 