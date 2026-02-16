import { DomainError } from '@albertoficial/backend-shared';

export const QuoteErrorMessages = {
  CLIENT_ID_REQUIRED: 'Client ID is required',
  LINES_REQUIRED: 'At least one line is required',
  INTERNAL_ERROR: 'Internal server error',
} as const;

export const QuoteErrorCodes = {
  QUOTE_CREATION_FAILED: 'QUOTE_CREATION_FAILED',
  QUOTE_UPDATE_FAILED: 'QUOTE_UPDATE_FAILED',
  QUOTE_NOT_FOUND: 'QUOTE_NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export class QuoteValidationError extends DomainError {
  constructor(message: string) {
    super(message, QuoteErrorCodes.VALIDATION_ERROR);
  }
}

export class QuoteNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Quote with id ${id} not found`, QuoteErrorCodes.QUOTE_NOT_FOUND);
  }
}
