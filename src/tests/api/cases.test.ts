import { createMocks } from 'node-mocks-http';
import casesHandler from '@/pages/api/cases';
import caseDetailHandler from '@/pages/api/cases/[id]';
import { 
  setupMongoDb, 
  teardownMongoDb, 
  clearMongoDb,
  createTestUser, 
  createTestCase 
} from '@/tests/utils/testUtils';
import { getServerSession } from 'next-auth/next';
import { Case } from '@/models/Case';

jest.mock('next-auth/next');

describe('Cases API', () => {
  beforeAll(async () => await setupMongoDb());
  afterAll(async () => await teardownMongoDb());
  afterEach(async () => {
    await clearMongoDb();
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

    it('should reject invalid case data', async () => {
      const user = await createTestUser();
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: user._id, email: user.email }
      });

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          contract: {
            title: 'Test Contract'
          }
        }
      });

      await casesHandler(req, res);
      expect(res._getStatusCode()).toBe(400);
    });

    it('should reject unauthenticated requests', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const { req, res } = createMocks({
        method: 'POST',
        body: { /* valid case data */ }
      });

      await casesHandler(req, res);
      expect(res._getStatusCode()).toBe(401);
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
        body: {
          status: 'EVALUATION'
        }
      });

      await caseDetailHandler(req, res);
      expect(res._getStatusCode()).toBe(200);
      
      const updatedCase = await Case.findById(case_._id);
      expect(updatedCase?.status).toBe('EVALUATION');
    });

    it('should reject invalid status updates', async () => {
      const user = await createTestUser();
      const case_ = await createTestCase(user._id);
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: user._id, email: user.email }
      });

      const { req, res } = createMocks({
        method: 'PATCH',
        query: { id: case_._id.toString() },
        body: {
          status: 'INVALID_STATUS'
        }
      });

      await caseDetailHandler(req, res);
      expect(res._getStatusCode()).toBe(400);
    });
  });

  describe('POST /api/cases/[id]/documents', () => {
    it('should upload case document', async () => {
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

      await caseDocumentsHandler(req, res);
      expect(res._getStatusCode()).toBe(201);
      
      const updatedCase = await Case.findById(case_._id);
      expect(updatedCase?.documents).toHaveLength(1);
    });

    it('should reject documents with invalid mime types', async () => {
      const user = await createTestUser();
      const case_ = await createTestCase(user._id);
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: user._id, email: user.email }
      });

      const { req, res } = createMocks({
        method: 'POST',
        query: { id: case_._id.toString() },
        body: {
          title: 'Invalid Document',
          type: 'EVIDENCE',
          fileUrl: 'https://example.com/doc.exe',
          metadata: {
            mimeType: 'application/x-msdownload'
          }
        }
      });

      await caseDocumentsHandler(req, res);
      expect(res._getStatusCode()).toBe(400);
    });
  });
}); 