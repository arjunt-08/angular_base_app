import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppHttpError, ErrorCode, HttpErrorDetails } from '../error-handling/http-error.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: unknown) => {
      // If already normalized (e.g. from timeout interceptor), forward as is
      if (error instanceof AppHttpError) {
        return throwError(() => error);
      }

      if (error instanceof HttpErrorResponse) {
        const normalized = normalizeHttpError(error);
        return throwError(() => normalized);
      }

      // Fallback for non-HTTP unexpected errors
      const fallback = new AppHttpError(
        0,
        ErrorCode.UNKNOWN_ERROR,
        error instanceof Error ? error.message : 'An unexpected network error occurred.',
        undefined,
        error,
      );
      return throwError(() => fallback);
    }),
  );
};

function normalizeHttpError(error: HttpErrorResponse): AppHttpError {
  let code = ErrorCode.UNKNOWN_ERROR;
  let userMessage = 'An unexpected error occurred while communicating with the server.';
  let details: HttpErrorDetails[] | undefined;

  switch (error.status) {
    case 0:
      code = ErrorCode.NETWORK_ERROR;
      userMessage = 'Cannot connect to server. Please check your internet connection.';
      break;
    case 400:
      code = ErrorCode.BAD_REQUEST;
      userMessage = error.error?.message || 'Invalid request. Please verify your input.';
      if (Array.isArray(error.error?.details)) {
        details = error.error.details;
      }
      break;
    case 401:
      code = ErrorCode.UNAUTHORIZED;
      userMessage = 'Your session has expired. Please log in again.';
      break;
    case 403:
      code = ErrorCode.FORBIDDEN;
      userMessage = 'You do not have permission to perform this action.';
      break;
    case 404:
      code = ErrorCode.NOT_FOUND;
      userMessage = error.error?.message || 'The requested resource was not found.';
      break;
    case 409:
      code = ErrorCode.CONFLICT;
      userMessage = error.error?.message || 'A conflicting resource already exists.';
      break;
    case 422:
      code = ErrorCode.VALIDATION_ERROR;
      userMessage = error.error?.message || 'Validation failed. Please correct highlighted fields.';
      if (Array.isArray(error.error?.details)) {
        details = error.error.details;
      }
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      code = ErrorCode.SERVER_ERROR;
      userMessage = 'Internal server error. Please try again later.';
      break;
    default:
      userMessage = error.error?.message || error.statusText || userMessage;
      break;
  }

  return new AppHttpError(error.status, code, userMessage, details, error);
}
