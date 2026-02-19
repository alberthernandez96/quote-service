import { v4 as uuidv4 } from 'uuid';
import { QuoteCreateDTO } from '@albertoficial/api-contracts';
import { BaseTracedCommand } from '../BaseTracedCommand';
import { quoteMetrics } from '@infrastructure';
import { type TracedHandlerContext } from '@albertoficial/observability-shared';

export class CreateQuoteCommand extends BaseTracedCommand<CreateQuoteCommand, unknown> {
  readonly commandId = uuidv4();
  readonly createdAt = new Date();
  readonly data: QuoteCreateDTO;
  readonly createdBy?: string;
  readonly correlationId?: string;

  protected readonly commandName = 'CreateQuoteCommand';
  protected readonly metrics = {
    counter: quoteMetrics.quotesCreated,
    histogram: quoteMetrics.quoteCreateDuration,
  };

  constructor(
    data: QuoteCreateDTO,
    createdBy?: string,
    correlationId?: string
  ) {
    super();
    this.data = data;
    this.createdBy = createdBy;
    this.correlationId = correlationId;
  }

  protected onSuccess(
    result: unknown,
    _duration: number,
    span: TracedHandlerContext['span']
  ): void {
    const dto = result as { id?: string; clientId?: string };

    if (dto?.id) {
      span.setAttribute('quote.id', String(dto.id));
    }

    if (this.data?.clientId) {
      span.setAttribute('quote.client_id', this.data.clientId);
    }
  }
}
