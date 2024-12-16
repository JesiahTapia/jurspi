import { createMocks } from 'node-mocks-http';
import archiveHandler from '@/pages/api/documents/[id]/archive';
import { setupTestDB, createTestUser, createTestDocument } from './setup';
import Case from '@/lib/models/Case';
import { getServerSession } from 'next-auth/next';

jest.mock('next-auth/next');

describe('Document Archiving', () => {
  let mongod;

  beforeAll(async () => {
    mongod = await setupTestDB();
  });

  afterAll(async () => {
    await mongod.stop();
  });

  it('should archive document and delete from S3', async () => {
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

    await archiveHandler(req, res);
    expect(res._getStatusCode()).toBe(200);

    const updatedCase = await Case.findById(case_._id);
    expect(updatedCase.documents[0].archived).toBe(true);
  });
}); 