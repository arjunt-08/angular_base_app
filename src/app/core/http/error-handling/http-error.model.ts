export enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface HttpErrorDetails {
  field?: string;
  code?: string;
  message: string;
}

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AppHttpError extends AppError {
  constructor(
    public readonly statusCode: number,
    code: ErrorCode,
    public readonly userMessage: string,
    public readonly details?: HttpErrorDetails[],
    originalError?: unknown,
  ) {
    super(userMessage, code, originalError);
    this.name = 'AppHttpError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
