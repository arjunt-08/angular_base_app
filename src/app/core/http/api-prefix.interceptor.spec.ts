import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { apiPrefixInterceptor } from './interceptors/api-prefix.interceptor';
import { APP_CONFIG } from '../config/app-config.token';
import { environment } from '@env/environment';

describe('apiPrefixInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: APP_CONFIG,
          useValue: { ...environment, apiBaseUrl: '/api/v1' },
        },
        provideHttpClient(withInterceptors([apiPrefixInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should prepend apiBaseUrl to relative requests', () => {
    httpClient.get('/projects').subscribe();

    const req = httpTesting.expectOne('/api/v1/projects');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should not duplicate /api if path starts with /api/projects', () => {
    httpClient.get('/api/projects').subscribe();

    const req = httpTesting.expectOne('/api/v1/projects');
    expect(req.request.url).toBe('/api/v1/projects');
    req.flush([]);
  });

  it('should leave absolute URLs unchanged', () => {
    httpClient.get('https://external-api.com/status').subscribe();

    const req = httpTesting.expectOne('https://external-api.com/status');
    expect(req.request.url).toBe('https://external-api.com/status');
    req.flush({});
  });
});
