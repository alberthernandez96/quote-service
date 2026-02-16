import { v4 as uuidv4 } from 'uuid';
import { Command } from '@albertoficial/backend-shared';
import { QuoteUpdateDTO } from '@albertoficial/api-contracts';

export class UpdateQuoteCommand implements Command {
  readonly commandId = uuidv4();
  readonly createdAt = new Date();
  readonly id: string;
  readonly data: QuoteUpdateDTO;
  readonly updatedBy?: string;
  readonly correlationId?: string;

  constructor(
    id: string,
    data: QuoteUpdateDTO,
    updatedBy?: string,
    correlationId?: string
  ) {
    this.id = id;
    this.data = data;
    this.updatedBy = updatedBy;
    this.correlationId = correlationId;
  }
}
