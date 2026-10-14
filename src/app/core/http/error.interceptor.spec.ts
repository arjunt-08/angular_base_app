import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { errorInterceptor } from './interceptors/error.interceptor';
import { AppHttpError, ErrorCode } from './error-handling/http-error.model';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should normalize 404 response to AppHttpError with NOT_FOUND code', () => {
    httpClient.get('/api/test-404').subscribe({
      next: () => expect.unreachable('Should have failed with 404'),
      error: (err: AppHttpError) => {
        expect(err).toBeInstanceOf(AppHttpError);
        expect(err.statusCode).toBe(404);
        expect(err.code).toBe(ErrorCode.NOT_FOUND);
      },
    });

    const req = httpTesting.expectOne('/api/test-404');
    req.flush({ message: 'Resource not found' }, { status: 404, statusText: 'Not Found' });
  });

  it('should normalize 401 response to AppHttpError with UNAUTHORIZED code', () => {
    httpClient.get('/api/test-401').subscribe({
      next: () => expect.unreachable('Should have failed with 401'),
      error: (err: AppHttpError) => {
        expect(err).toBeInstanceOf(AppHttpError);
        expect(err.statusCode).toBe(401);
        expect(err.code).toBe(ErrorCode.UNAUTHORIZED);
      },
    });

    const req = httpTesting.expectOne('/api/test-401');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });
  });

  it('should normalize 0 status to NETWORK_ERROR', () => {
    httpClient.get('/api/network-down').subscribe({
      next: () => expect.unreachable('Should have failed with network error'),
      error: (err: AppHttpError) => {
        expect(err).toBeInstanceOf(AppHttpError);
        expect(err.statusCode).toBe(0);
        expect(err.code).toBe(ErrorCode.NETWORK_ERROR);
      },
    });

    const req = httpTesting.expectOne('/api/network-down');
    req.error(new ProgressEvent('error'), { status: 0 });
  });
});
