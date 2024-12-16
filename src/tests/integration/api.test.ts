import { createTestRequest } from '../setup';
import casesHandler from '@/pages/api/cases';

describe('API Routes', () => {
  test('GET /api/cases returns list of cases', async () => {
    const { req, res } = createTestRequest();
    req.method = 'GET';
    
    await casesHandler(req, res);
    
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.arrayContaining([])
    );
  });

  test('POST /api/cases creates new case', async () => {
    const { req, res } = createTestRequest();
    req.method = 'POST';
    req.body = {
      title: 'Test Case',
      description: 'Test Description',
      claimAmount: 1000
    };
    
    await casesHandler(req, res);
    
    expect(res._getStatusCode()).toBe(201);
  });
}); 