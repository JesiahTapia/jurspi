import { createMocks } from 'node-mocks-http';
import { getServerSession } from 'next-auth/next';
import caseHandler from '@/pages/api/cases';
import caseDetailHandler from '@/pages/api/cases/[id]';
import documentHandler from '@/pages/api/cases/[id]/documents';
import { createTestUser, createTestCase, setupTestDB, closeTestDB, clearTestDB } from '../shared/setup';
import { Case } from '@/models/Case';

jest.mock('next-auth/next');

describe('Ticket #3: Core API Routes', () => {
  beforeAll(async () => await setupTestDB());
  afterAll(async () => await closeTestDB());
  beforeEach(async () => {
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
            name: 'Test User',
            email: 'test@example.com',
            address: {
              street: '123 Test St',
              city: 'Test City',
              state: 'TS',
              zipCode: '12345',
              country: 'Test Country'
            }
          },
          dispute: {
            description: 'Test dispute',
            amount: 1000,
            category: 'CONTRACT'
          },
          contract: {
            title: 'Test Contract',
            fileUrl: 'https://example.com/contract.pdf',
            clauses: [{ number: 1, text: 'Test clause' }]
          },
          claimDetails: {
            description: 'Test claim',
            amount: 1000,
            breachedClauses: [1],
            supportingEvidence: []
          }
        }
      });

      await caseHandler(req, res);
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
        query: { id: case_._id.toString() },
        headers: {
          'content-type': 'application/json'
        }
      });

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
        headers: {
          'content-type': 'application/json'
        },
        body: {
          title: 'Evidence Document',
          type: 'EVIDENCE',
          fileUrl: 'https://example.com/evidence.pdf',
          metadata: {
            size: 1024,
            mimeType: 'application/pdf'
          }
        }
      });

      await documentHandler(req, res);
      expect(res._getStatusCode()).toBe(201);
      
      const updatedCase = await Case.findById(case_._id);
      expect(updatedCase?.documents).toHaveLength(1);
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

      await caseHandler(req, res);
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
        headers: {
          'content-type': 'application/json'
        },
        body: { 
          status: 'EVALUATION' 
        }
      });

      await caseDetailHandler(req, res);
      expect(res._getStatusCode()).toBe(200);
    });
  });
}); 