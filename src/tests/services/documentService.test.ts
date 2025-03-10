import { DocumentService } from '@/lib/services/documentService';
import { setupMongoDb, teardownMongoDb, clearMongoDb, createTestUser, createTestCase, s3Mock } from '@/tests/utils/testUtils';
import { VirusScanService } from '@/lib/services/virusScanService';

jest.mock('@/lib/services/virusScanService');

describe('Document Service', () => {
  beforeAll(async () => await setupMongoDb());
  afterAll(async () => await teardownMongoDb());
  
  beforeEach(async () => {
    await clearMongoDb();
    s3Mock.reset();
    jest.clearAllMocks();
    (VirusScanService.scanBuffer as jest.Mock).mockResolvedValue(true);
  });

  it('should validate and scan files', async () => {
    const file = {
      originalname: 'test.pdf',
      buffer: Buffer.from('test document'),
      mimetype: 'application/pdf',
      size: 1024
    } as Express.Multer.File;

    await DocumentService.validateFile(file);
    expect(VirusScanService.scanBuffer).toHaveBeenCalledWith(file.buffer);
  });

  it('should reject infected files', async () => {
    (VirusScanService.scanBuffer as jest.Mock).mockResolvedValue(false);

    const file = {
      originalname: 'infected.pdf',
      buffer: Buffer.from('infected'),
      mimetype: 'application/pdf',
      size: 1024
    } as Express.Multer.File;

    await expect(DocumentService.validateFile(file)).rejects.toThrow('File failed virus scan');
  });
}); 