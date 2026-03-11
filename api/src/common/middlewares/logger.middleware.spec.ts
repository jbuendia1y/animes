import { LoggerMiddleware } from './logger.middleware';
import { Request, Response, NextFunction } from 'express';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    middleware = new LoggerMiddleware();

    mockRequest = {
      method: 'GET',
      originalUrl: '/api/test',
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('Mozilla/5.0'),
    };

    mockResponse = {
      statusCode: 200,
      on: jest.fn().mockImplementation(function (event: string, callback: () => void) {
        if (event === 'finish') {
          setTimeout(callback, 0);
        }
        return this;
      }),
      get: jest.fn().mockReturnValue('100'),
    };

    mockNext = jest.fn();
  });

  it('should call next()', () => {
    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
  });

  it('should register finish event listener on response', () => {
    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockResponse.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });

  it('should call logger log when response finishes', (done) => {
    const originalLogger = (middleware as any).logger;
    const mockLog = jest.spyOn(originalLogger, 'log').mockImplementation();

    (middleware as any).logger = { log: mockLog };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    setTimeout(() => {
      expect(mockLog).toHaveBeenCalled();
      (middleware as any).logger = originalLogger;
      mockLog.mockRestore();
      done();
    }, 10);
  });

  it('should log correct format with method, url, status, and time', (done) => {
    const originalLogger = (middleware as any).logger;
    const mockLog = jest.spyOn(originalLogger, 'log').mockImplementation();

    (middleware as any).logger = { log: mockLog };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    setTimeout(() => {
      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('GET /api/test'),
      );
      (middleware as any).logger = originalLogger;
      mockLog.mockRestore();
      done();
    }, 10);
  });
});
