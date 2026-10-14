import { ErrorHandler, Injectable, Injector, inject } from '@angular/core';
import { LoggerService } from '../../logging/logger.service';
import { NotificationService } from '../../notification/notification.service';
import { AppHttpError } from './http-error.model';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly injector = inject(Injector);

  handleError(error: unknown): void {
    // Lazily resolve LoggerService and NotificationService to prevent circular DI during startup
    const logger = this.injector.get(LoggerService);
    const notifications = this.injector.get(NotificationService);

    if (error instanceof AppHttpError) {
      logger.error(`[HTTP ${error.statusCode}] ${error.userMessage}`, 'GlobalErrorHandler', error);
      // HTTP errors are usually handled per-feature or by interceptor; we only notify if not already handled
      return;
    }

    const unwrappedError = error instanceof Error ? error : new Error(String(error));
    logger.error(
      `Uncaught Application Exception: ${unwrappedError.message}`,
      'GlobalErrorHandler',
      unwrappedError,
    );

    notifications.error(
      'An unexpected error occurred. Our team has been notified.',
      'Application Error',
    );
  }
}
