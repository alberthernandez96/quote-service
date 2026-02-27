import { ErrorHandler as BaseErrorHandler } from '@albertoficial/backend-shared';
import { QuoteErrorCodes } from '@domain';

export class ErrorHandler extends BaseErrorHandler {
  constructor() {
    super({
      [QuoteErrorCodes.QUOTE_NOT_FOUND]: 404,
      [QuoteErrorCodes.VALIDATION_ERROR]: 400,
      [QuoteErrorCodes.QUOTE_CREATION_FAILED]: 400,
      [QuoteErrorCodes.QUOTE_UPDATE_FAILED]: 400,
      [QuoteErrorCodes.INTERNAL_ERROR]: 500,
    });
  }
}
