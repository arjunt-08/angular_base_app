import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { REQUEST_TIMEOUT, timeoutInterceptor } from './interceptors/timeout.interceptor';
import { AppHttpError, ErrorCode } from './error-handling/http-error.model';

describe('timeoutInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([timeoutInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should timeout and normalize to AppHttpError when request exceeds timeout threshold', async () => {
    let capturedError: AppHttpError | null = null;

    httpClient
      .get('/api/slow-call', {
        context: new HttpContext().set(REQUEST_TIMEOUT, 50),
      })
      .subscribe({
        next: () => expect.unreachable('Should have timed out'),
        error: (err: AppHttpError) => {
          capturedError = err;
        },
      });

    const req = httpTesting.expectOne('/api/slow-call');

    // Wait 80ms to exceed 50ms timeout threshold
    await new Promise((resolve) => setTimeout(resolve, 80));

    expect(capturedError).not.toBeNull();
    expect(capturedError!.code).toBe(ErrorCode.TIMEOUT_ERROR);
    expect(capturedError!.statusCode).toBe(408);
  });
});
