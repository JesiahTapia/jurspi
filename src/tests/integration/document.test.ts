import mongoose from 'mongoose';
import { VirusScanService } from '@/lib/services/virusScanService';
import { DocumentService } from '@/lib/services/documentService';
import { setupTestDB, closeTestDB, clearTestDB, createTestUser, createTestCase } from '../api/setup';
import { Document } from '@/lib/models/Document';
import { s3Mock } from '../document-handling/setup';

describe('Document Service Integration Tests', () => {
  beforeAll(async () => await setupTestDB());
  afterAll(async () => await closeTestDB());
  
  beforeEach(async () => {
    await clearTestDB();
    s3Mock.reset();
  });

  it('should create new document', async () => {
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

  it('should handle version control', async () => {
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

  it('should handle document archiving', async () => {
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

    const archivedDoc = await DocumentService.softDelete(doc.documentId);
    expect(archivedDoc.isActive).toBe(false);
  });
}); 