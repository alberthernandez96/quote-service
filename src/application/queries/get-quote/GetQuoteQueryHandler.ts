import { QueryHandler } from '@albertoficial/backend-shared';
import { QuoteNotFoundError } from '@domain';
import { QuoteDtoMapper, GetQuoteQuery, IQuoteRepository } from '@application';

export class GetQuoteQueryHandler implements QueryHandler<GetQuoteQuery, unknown> {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async handle(query: GetQuoteQuery): Promise<unknown> {
    const quote = await this.quoteRepository.findById(query.id);
    if (!quote) {
      throw new QuoteNotFoundError(query.id);
    }
    return QuoteDtoMapper.toDto(quote);
  }
}
