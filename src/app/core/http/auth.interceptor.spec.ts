import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authInterceptor, SKIP_AUTH } from './interceptors/auth.interceptor';
import { TokenStorageService } from '../auth/services/token-storage.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;
  let mockTokenStorage: { getAccessToken: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockTokenStorage = {
      getAccessToken: vi.fn().mockReturnValue('dummy_test_jwt_token'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: TokenStorageService, useValue: mockTokenStorage },
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should attach Bearer token to request header when token is present', () => {
    httpClient.get('/api/protected').subscribe();

    const req = httpTesting.expectOne('/api/protected');
    expect(req.request.headers.get('Authorization')).toBe('Bearer dummy_test_jwt_token');
    req.flush({});
  });

  it('should skip attaching Authorization header when SKIP_AUTH context is true', () => {
    httpClient
      .get('/api/public', {
        context: new HttpContext().set(SKIP_AUTH, true),
      })
      .subscribe();

    const req = httpTesting.expectOne('/api/public');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should not overwrite an existing custom Authorization header', () => {
    httpClient
      .get('/api/custom-auth', {
        headers: { Authorization: 'Basic dXNlcjpwYXNz' },
      })
      .subscribe();

    const req = httpTesting.expectOne('/api/custom-auth');
    expect(req.request.headers.get('Authorization')).toBe('Basic dXNlcjpwYXNz');
    req.flush({});
  });
});
