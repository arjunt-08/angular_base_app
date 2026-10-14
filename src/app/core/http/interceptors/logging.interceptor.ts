import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { LoggerService } from '../../logging/logger.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const started = performance.now();

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const elapsed = (performance.now() - started).toFixed(1);
          logger.debug(
            `[HTTP] ${req.method} ${req.urlWithParams} -> ${event.status} (${elapsed}ms)`,
            'HttpClient',
          );
        }
      },
      error: (error) => {
        const elapsed = (performance.now() - started).toFixed(1);
        const status = error.status ?? 'UNKNOWN';
        logger.warn(
          `[HTTP ERROR] ${req.method} ${req.urlWithParams} -> ${status} (${elapsed}ms)`,
          'HttpClient',
        );
      },
    }),
  );
};
