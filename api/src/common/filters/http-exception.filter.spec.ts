import { AllExceptionsFilter } from './http-exception.filter';
import {
  HttpException,
  HttpStatus,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: Partial<Response>;
  let mockHost: ArgumentsHost;
  let mockLoggerError: jest.SpyInstance;

  beforeEach(() => {
    filter = new AllExceptionsFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: jest.fn().mockReturnValue({}),
      }),
    } as unknown as ArgumentsHost;

    mockLoggerError = jest.spyOn(
      (filter as any).logger,
      'error',
    ).mockImplementation();
  });

  afterEach(() => {
    mockLoggerError.mockRestore();
  });

  it('should catch HttpException and return proper response', () => {
    const exception = new HttpException(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Bad Request',
        timestamp: expect.any(String),
      }),
    );
  });

  it('should catch non-HttpException and return 500', () => {
    const exception = new Error('Internal error');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: expect.any(String),
      }),
    );
  });

  it('should log the error', () => {
    const exception = new HttpException('Error', HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockHost);

    expect(mockLoggerError).toHaveBeenCalled();
  });

  it('should handle custom error messages from HttpException', () => {
    const exception = new HttpException(
      { message: 'Custom error', extra: 'data' },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockHost);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Custom error',
      }),
    );
  });
});
