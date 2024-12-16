import { createMocks } from 'node-mocks-http';
import casesHandler from '@/pages/api/cases';
import caseDetailHandler from '@/pages/api/cases/[id]';
import { setupTestDB, closeTestDB, clearTestDB, createTestUser, createTestCase } from './setup';
import { getServerSession } from 'next-auth/next';

jest.mock('next-auth/next');

describe('Cases API', () => {
  beforeAll(async () => await setupTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => {
    await clearTestDB();
    jest.clearAllMocks();
  });

  describe('POST /api/cases', () => {
    it('should create a new case', async () => {
      const user = await createTestUser();
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: user._id, email: user.email }
      });

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          contract: {
            title: 'Test Contract',
            fileUrl: 'https://example.com/contract.pdf',
            clauses: [{ number: 1, text: 'Test clause' }]
          },
          claimDetails: {
            description: 'Test claim',
            amount: 1000,
            breachedClauses: [1],
            supportingEvidence: ['https://example.com/evidence.pdf']
          }
        }
      });

      await casesHandler(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toHaveProperty('success', true);
    });
  });

  describe('GET /api/cases/[id]', () => {
    it('should return case details', async () => {
      const user = await createTestUser();
      const case_ = await createTestCase(user._id);
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: user._id, email: user.email }
      });

      const { req, res } = createMocks({
        method: 'GET',
        query: { id: case_._id.toString() }
      });

      await caseDetailHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toHaveProperty('data.claimant', user._id.toString());
    });
  });
}); 