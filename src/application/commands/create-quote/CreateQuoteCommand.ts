import { v4 as uuidv4 } from 'uuid';
import { Command } from '@albertoficial/backend-shared';
import { QuoteCreateDTO } from '@albertoficial/api-contracts';

export class CreateQuoteCommand implements Command {
  readonly commandId = uuidv4();
  readonly createdAt = new Date();
  readonly data: QuoteCreateDTO;
  readonly createdBy?: string;
  readonly correlationId?: string;

  constructor(
    data: QuoteCreateDTO,
    createdBy?: string,
    correlationId?: string
  ) {
    this.data = data;
    this.createdBy = createdBy;
    this.correlationId = correlationId;
  }
}
