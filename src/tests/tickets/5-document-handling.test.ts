import { createMocks } from 'node-mocks-http';
import { 
  setupMongoDb, 
  teardownMongoDb, 
  clearMongoDb,
  createTestUser, 
  createTestCase,
  s3Mock 
} from '../utils/testUtils';
import { DocumentService } from '@/lib/services/documentService';
import { VirusScanService } from '@/lib/services/virusScanService';
import documentHandler from '@/pages/api/cases/[id]/documents';
import { getServerSession } from 'next-auth';
import { Case } from '@/models/Case';
import mongoose from 'mongoose';

jest.mock('next-auth/next');
jest.mock('@/lib/services/virusScanService');

describe('Ticket #5: Document Upload and Management System', () => {
  beforeAll(async () => await setupMongoDb());
  afterAll(async () => await teardownMongoDb());
  beforeEach(async () => {
    await clearMongoDb();
    jest.clearAllMocks();
    s3Mock.reset();
    (VirusScanService.scanBuffer as jest.Mock).mockResolvedValue(true);
  });

  describe('Document Upload', () => {
    it('should upload document with proper validation', async () => {
      const user = await createTestUser();
      const case_ = await createTestCase(user._id);

      const file = {
        originalname: 'test.pdf',
        buffer: Buffer.from('test document'),
        mimetype: 'application/pdf',
        size: 1024
      } as Express.Multer.File;

      const doc = await DocumentService.createDocument({
        file,
        caseId: case_._id.toString(),
        uploadedBy: user._id.toString(),
        type: 'EVIDENCE',
        title: 'Test Document'
      });

      expect(doc.title).toBe('Test Document');
      expect(doc.version).toBe(1);
      expect(doc.fileSize).toBe(1024);
      expect(doc.mimeType).toBe('application/pdf');
    });

    it('should reject invalid file types', async () => {
      const user = await createTestUser();
      const case_ = await createTestCase(user._id);

      const file = {
        originalname: 'test.exe',
        buffer: Buffer.from('test'),
        mimetype: 'application/x-msdownload',
        size: 1024
      } as Express.Multer.File;

      await expect(DocumentService.createDocument({
        file,
        caseId: case_._id.toString(),
        uploadedBy: user._id.toString(),
        type: 'EVIDENCE',
        title: 'Test Document'
      })).rejects.toThrow('File type not allowed');
    });

    it('should scan files for viruses', async () => {
      const user = await createTestUser();
      const case_ = await createTestCase(user._id);

      (VirusScanService.scanBuffer as jest.Mock).mockResolvedValue(false);

      const file = {
        originalname: 'infected.pdf',
        buffer: Buffer.from('test document'),
        mimetype: 'application/pdf',
        size: 1024
      } as Express.Multer.File;

      await expect(DocumentService.createDocument({
        file,
        caseId: case_._id.toString(),
        uploadedBy: user._id.toString(),
        type: 'EVIDENCE',
        title: 'Test Document'
      })).rejects.toThrow('File failed virus scan');
    });
  });

  describe('Version Control', () => {
    it('should handle document versioning', async () => {
      const user = await createTestUser();
      const case_ = await createTestCase(user._id);

      const file = {
        originalname: 'test.pdf',
        buffer: Buffer.from('test document'),
        mimetype: 'application/pdf',
        size: 1024
      } as Express.Multer.File;

      const doc = await DocumentService.createDocument({
        file,
        caseId: case_._id.toString(),
        uploadedBy: user._id.toString(),
        type: 'EVIDENCE',
        title: 'Test Document'
      });

      const updatedFile = {
        ...file,
        buffer: Buffer.from('updated document')
      };

      const newVersion = await DocumentService.createNewVersion(doc.documentId, updatedFile);
      expect(newVersion.version).toBe(2);
    });
  });

  describe('Access Control', () => {
    it('should reject unauthorized access', async () => {
      const user = await createTestUser();
      const case_ = await createTestCase(user._id);
      const unauthorizedUser = await createTestUser();
      
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: unauthorizedUser._id, email: unauthorizedUser.email }
      });

      const file = {
        originalname: 'test.pdf',
        buffer: Buffer.from('test document'),
        mimetype: 'application/pdf',
        size: 1024
      } as Express.Multer.File;

      const { req, res } = createMocks({
        method: 'POST',
        query: { id: case_._id.toString() },
        file,
        body: {
          title: 'Evidence',
          type: 'EVIDENCE'
        }
      });

      // Attach file to request like in upload.test.ts
      (req as any).file = file;
      
      await documentHandler(req, res);
      expect(res._getStatusCode()).toBe(403);
    });
  });
});
