import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigService } from '../../config/config.service';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(ConfigService);

  // If request is already an absolute URL or static asset, pass through
  if (
    req.url.startsWith('http://') ||
    req.url.startsWith('https://') ||
    req.url.startsWith('assets/') ||
    req.url.startsWith('/assets/')
  ) {
    return next(req);
  }

  const baseUrl = (config?.apiBaseUrl || '/api/v1').replace(/\/$/, '');

  // If request already includes the base URL prefix, do not duplicate
  if (req.url.startsWith(baseUrl)) {
    return next(req);
  }

  // Handle case where baseUrl has /api/v1 and req.url starts with /api/
  let sanitizedPath = req.url.startsWith('/') ? req.url : `/${req.url}`;
  if (baseUrl.endsWith('/api/v1') && sanitizedPath.startsWith('/api/')) {
    sanitizedPath = sanitizedPath.replace(/^\/api/, '');
  }

  const apiReq = req.clone({
    url: `${baseUrl}${sanitizedPath}`,
  });

  return next(apiReq);
};
