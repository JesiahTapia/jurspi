import { createMocks } from 'node-mocks-http';
import casesHandler from '@/pages/api/cases';
import { default as caseDetailHandler } from '@/pages/api/cases/[id]';
import { setupTestDB, closeTestDB, clearTestDB, createTestUser, createTestCase } from '@/tests/api/setup';
import { getServerSession } from 'next-auth/next';
import { default as documentHandler } from '@/pages/api/cases/[id]/documents';

jest.mock('next-auth/next');

describe('Ticket #3: Core API Routes', () => {
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
        }
      });

      req.user = { id: user._id };
      await casesHandler(req, res);
      expect(res._getStatusCode()).toBe(201);
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

      req.user = { id: user._id };
      await caseDetailHandler(req, res);
      expect(res._getStatusCode()).toBe(200);
    });
  });

  describe('POST /api/cases/[id]/documents', () => {
    it('should upload document to case', async () => {
      const user = await createTestUser();
      const case_ = await createTestCase(user._id);
      
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: user._id, email: user.email }
      });

      const { req, res } = createMocks({
        method: 'POST',
        query: { id: case_._id.toString() },
        body: {
          title: 'Evidence Document',
          type: 'EVIDENCE',
          fileUrl: 'https://example.com/evidence.pdf'
        }
      });

      req.user = { id: user._id };
      await documentHandler(req, res);
      expect(res._getStatusCode()).toBe(201);
    });
  });

  describe('GET /api/cases', () => {
    it('should list all cases', async () => {
      const user = await createTestUser();
      await createTestCase(user._id);
      
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: user._id, email: user.email }
      });

      const { req, res } = createMocks({
        method: 'GET'
      });

      req.user = { id: user._id };
      await casesHandler(req, res);
      expect(res._getStatusCode()).toBe(200);
    });
  });

  describe('PATCH /api/cases/[id]', () => {
    it('should update case status', async () => {
      const user = await createTestUser();
      const case_ = await createTestCase(user._id);
      
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: user._id, email: user.email }
      });

      const { req, res } = createMocks({
        method: 'PATCH',
        query: { id: case_._id.toString() },
        body: { status: 'EVALUATION' }
      });

      req.user = { id: user._id };
      await caseDetailHandler(req, res);
      expect(res._getStatusCode()).toBe(200);
    });
  });
}); 