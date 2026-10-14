import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TimeoutError, catchError, throwError, timeout } from 'rxjs';
import { ConfigService } from '../../config/config.service';
import { AppHttpError, ErrorCode } from '../error-handling/http-error.model';

export const REQUEST_TIMEOUT = new HttpContextToken<number | null>(() => null);

export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(ConfigService, { optional: true });
  const timeoutMs = req.context.get(REQUEST_TIMEOUT) ?? config?.apiTimeoutMs ?? 15000;

  // If timeout is disabled (<= 0), proceed without timeout
  if (timeoutMs <= 0) {
    return next(req);
  }

  return next(req).pipe(
    timeout(timeoutMs),
    catchError((err: unknown) => {
      if (err instanceof TimeoutError) {
        return throwError(
          () =>
            new AppHttpError(
              408,
              ErrorCode.TIMEOUT_ERROR,
              `Request timed out after ${timeoutMs}ms. Please check your network and try again.`,
              undefined,
              err,
            ),
        );
      }
      return throwError(() => err);
    }),
  );
};
