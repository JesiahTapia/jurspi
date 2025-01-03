import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Case from '../lib/models/Case';
import Arbitrator from '../lib/models/Arbitrator';
import { createTestUser } from './api/setup';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Schema Design Tests', () => {
  // Test Case Schema
  describe('Case Schema', () => {
    it('should create a case with all required fields', async () => {
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
    });
  });

  // Test Arbitrator Schema
  describe('Arbitrator Schema', () => {
    it('should create an arbitrator with required fields', async () => {
      const user = await createTestUser();
      const arbitratorData = {
        userId: user._id,
        specializations: ['Contract Law'],
        qualifications: [{
          title: 'Bar License',
          issuer: 'NY State Bar',
          dateObtained: new Date()
        }],
        experience: {
          yearsOfPractice: 5,
          totalCases: 0
        }
      };

      const savedArbitrator = await Arbitrator.create(arbitratorData);
      expect(savedArbitrator.specializations).toContain('Contract Law');
    });
  });
}); 