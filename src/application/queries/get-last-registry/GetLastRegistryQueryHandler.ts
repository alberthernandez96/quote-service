import { QueryHandler } from '@albertoficial/backend-shared';
import { QuoteLastRegistryNotFoundError } from '@domain';
import { QuoteDtoMapper, GetLastRegistryQuery, IQuoteRepository } from '@application';

export class GetLastRegistryQueryHandler implements QueryHandler<GetLastRegistryQuery, unknown> {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async handle(query: GetLastRegistryQuery): Promise<unknown> {
    return query.executeWithTracing(async () => {
      const quote = await this.quoteRepository.findLastRegistry();
      if (!quote) {
        throw new QuoteLastRegistryNotFoundError();
      }
      return QuoteDtoMapper.toDto(quote);
    });
  }
}
