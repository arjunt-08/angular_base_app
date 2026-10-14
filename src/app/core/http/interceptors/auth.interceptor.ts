import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../../auth/services/token-storage.service';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);

  // Skip auth header if explicitly flagged
  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  // Preserve explicit authorization header if caller already supplied one
  if (req.headers.has('Authorization')) {
    return next(req);
  }

  const token = tokenStorage.getAccessToken();
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
