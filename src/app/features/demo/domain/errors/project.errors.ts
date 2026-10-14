import { AppError, ErrorCode } from '@core/http/error-handling/http-error.model';

export class ProjectNotFoundError extends AppError {
  constructor(public readonly projectId: string) {
    super(`Project with ID "${projectId}" was not found.`, ErrorCode.NOT_FOUND);
    this.name = 'ProjectNotFoundError';
  }
}

export class DuplicateProjectError extends AppError {
  constructor(public readonly projectCode: string) {
    super(`A project with code "${projectCode}" already exists.`, ErrorCode.CONFLICT);
    this.name = 'DuplicateProjectError';
  }
}

export class ProjectValidationDomainError extends AppError {
  constructor(message: string) {
    super(message, ErrorCode.VALIDATION_ERROR);
    this.name = 'ProjectValidationDomainError';
  }
}
