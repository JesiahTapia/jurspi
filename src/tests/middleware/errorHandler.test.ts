import { createMocks } from 'node-mocks-http';
import { errorHandler, ApiError } from '@/middleware/errorHandler';

describe('Error Handler Middleware', () => {
  it('should handle ApiError correctly', () => {
    const { req, res } = createMocks();
    const error = new ApiError(400, 'Bad Request');

    errorHandler(error, req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Bad Request'
    });
  });

  it('should handle unknown errors', () => {
    const { req, res } = createMocks();
    const error = new Error('Unknown error');

    errorHandler(error, req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Internal server error'
    });
  });
}); 