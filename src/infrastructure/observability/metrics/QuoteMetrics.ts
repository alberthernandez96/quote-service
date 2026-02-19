import { MetricsFactory } from '@albertoficial/observability-shared';

const metricsFactory = new MetricsFactory('quote-service', '1.0.0');

export const quoteMetrics = {
  // Quote operations counters
  quotesCreated: metricsFactory.createCounter('quotes.created', {
    description: 'Total number of quotes created',
  }),

  quotesUpdated: metricsFactory.createCounter('quotes.updated', {
    description: 'Total number of quotes updated',
  }),

  quotesRetrieved: metricsFactory.createCounter('quotes.retrieved', {
    description: 'Total number of quotes retrieved',
  }),

  quotesDeleted: metricsFactory.createCounter('quotes.deleted', {
    description: 'Total number of quotes deleted',
  }),

  // Quote operation durations
  quoteCreateDuration: metricsFactory.createHistogram('quotes.create.duration', {
    description: 'Duration of quote creation operations in milliseconds',
    unit: 'ms',
  }),

  quoteUpdateDuration: metricsFactory.createHistogram('quotes.update.duration', {
    description: 'Duration of quote update operations in milliseconds',
    unit: 'ms',
  }),

  quoteRetrieveDuration: metricsFactory.createHistogram('quotes.retrieve.duration', {
    description: 'Duration of quote retrieval operations in milliseconds',
    unit: 'ms',
  }),
};
