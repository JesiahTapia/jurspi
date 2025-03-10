import { createMocks } from 'node-mocks-http';
import versionHandler from '@/pages/api/documents/[id]/version';
import { 
  setupMongoDb, 
  teardownMongoDb, 
  clearMongoDb,
  createTestUser, 
  createTestDocument 
} from '@/tests/utils/testUtils';
import Case from '@/lib/models/Case';
import { getServerSession } from 'next-auth/next';

jest.mock('next-auth/next');

describe('Document Versioning', () => {
  beforeAll(async () => {
    await setupMongoDb();
  });

  afterAll(async () => {
    await teardownMongoDb();
  });

  beforeEach(async () => {
    await clearMongoDb();
  });

  it('should increment document version', async () => {
    const user = await createTestUser();
    const doc = await createTestDocument(user._id);
    const case_ = await Case.create({
      claimant: user._id,
      documents: [doc]
    });

    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: user._id }
    });

    const { req, res } = createMocks({
      method: 'POST',
      query: { id: case_.documents[0]._id.toString() }
    });

    await versionHandler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty('version', 2);
  });
}); 