import { v4 as uuidv4 } from 'uuid';
import { QuoteUpdateDTO } from '@albertoficial/api-contracts';
import { BaseTracedCommand } from '../BaseTracedCommand';
import { quoteMetrics } from '@infrastructure';

export class UpdateQuoteCommand extends BaseTracedCommand<UpdateQuoteCommand, unknown> {
  readonly commandId = uuidv4();
  readonly createdAt = new Date();
  readonly id: string;
  readonly data: QuoteUpdateDTO;
  readonly updatedBy?: string;
  readonly correlationId?: string;

  protected readonly commandName = 'UpdateQuoteCommand';
  protected readonly metrics = {
    counter: quoteMetrics.quotesUpdated,
    histogram: quoteMetrics.quoteUpdateDuration,
  };

  constructor(
    id: string,
    data: QuoteUpdateDTO,
    updatedBy?: string,
    correlationId?: string
  ) {
    super();
    this.id = id;
    this.data = data;
    this.updatedBy = updatedBy;
    this.correlationId = correlationId;
  }
}
