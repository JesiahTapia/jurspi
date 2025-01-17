import { createMocks } from 'node-mocks-http';
import uploadHandler from '@/pages/api/documents/upload';
import { 
  setupMongoDb, 
  teardownMongoDb, 
  clearMongoDb,
  createTestUser, 
  createTestCase,
  s3Mock 
} from '@/tests/utils/testUtils';
import { getServerSession } from 'next-auth/next';

jest.mock('next-auth/next');

describe('Document Upload', () => {
  beforeAll(async () => await setupMongoDb());
  afterAll(async () => await teardownMongoDb());
  
  beforeEach(async () => {
    await clearMongoDb();
    s3Mock.reset();
    jest.clearAllMocks();
  });

  it('should handle file upload successfully', async () => {
    const user = await createTestUser();
    const case_ = await createTestCase(user._id);
    
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: user._id }
    });

    const buffer = Buffer.from('test document');
    const file = {
      fieldname: 'file',
      originalname: 'test.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer,
      size: buffer.length
    };

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        caseId: case_._id.toString(),
        type: 'EVIDENCE',
        title: 'Test Document'
      }
    });

    // Attach file to request
    (req as any).file = file;
    req.user = { id: user._id.toString() };

    await uploadHandler(req, res);
    expect(res._getStatusCode()).toBe(201);
    
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Test Document');
  });

  it('should validate file type', async () => {
    const user = await createTestUser();
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: user._id }
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        mimeType: 'invalid/type',
        size: 1024
      }
    });

    await uploadHandler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('should validate file size', async () => {
    const user = await createTestUser();
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: user._id }
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        mimeType: 'application/pdf',
        size: 20 * 1024 * 1024 // 20MB (too large)
      }
    });

    await uploadHandler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });
}); 