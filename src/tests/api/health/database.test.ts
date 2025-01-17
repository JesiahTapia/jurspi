import { NextApiRequest, NextApiResponse } from 'next';
import healthHandler from '@/pages/api/health/database';
import { setupMongoDb, teardownMongoDb, clearMongoDb } from '@/tests/utils/testUtils';
import mongoose from 'mongoose';

const createMockReq = (): Partial<NextApiRequest> => ({
  method: 'GET'
});

const createMockRes = () => {
  const res: Partial<NextApiResponse> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    end: jest.fn()
  };
  return res;
};

describe('Database Health Endpoint', () => {
  beforeAll(async () => {
    await setupMongoDb();
  });

  afterAll(async () => {
    await teardownMongoDb();
  });

  beforeEach(async () => {
    await clearMongoDb();
  });

  it('should return 200 when database is connected', async () => {
    const req = createMockReq();
    const res = createMockRes();
    
    await healthHandler(req as NextApiRequest, res as NextApiResponse);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'connected',
      database: expect.any(String)
    }));
  });

  it('should return 405 for non-GET requests', async () => {
    const req = createMockReq();
    req.method = 'POST';
    const res = createMockRes();
    
    await healthHandler(req as NextApiRequest, res as NextApiResponse);
    
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalled();
  });
}); 