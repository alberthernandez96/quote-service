import { v4 as uuidv4 } from 'uuid';
import { BaseTracedQuery } from '../BaseTracedQuery';
import { quoteMetrics } from '@infrastructure';

export class GetQuoteQuery extends BaseTracedQuery<GetQuoteQuery, unknown> {
  readonly queryId = uuidv4();
  readonly createdAt = new Date();
  readonly createdBy?: string;
  readonly correlationId?: string;
  readonly id: string;

  protected readonly queryName = 'GetQuoteQuery';
  protected readonly metrics = {
    counter: quoteMetrics.quotesRetrieved,
    histogram: quoteMetrics.quoteRetrieveDuration,
    counterLabels: { type: 'single' },
    histogramLabels: { type: 'single' },
  };

  constructor(
    id: string,
    createdBy?: string,
    correlationId?: string
  ) {
    super();
    this.id = id;
    this.createdBy = createdBy;
    this.correlationId = correlationId;
  }
}
