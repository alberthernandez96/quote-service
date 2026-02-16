import { QueryHandler } from '@albertoficial/backend-shared';
import { QuoteDtoMapper, GetQuoteListQuery, IQuoteRepository } from '@application';

export class GetQuoteListQueryHandler implements QueryHandler<GetQuoteListQuery, unknown> {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async handle(query: GetQuoteListQuery): Promise<unknown> {
    const { items, total } = await this.quoteRepository.list(query.limit, (query.page - 1) * query.limit);
    const quoteItems = items.map((q) => QuoteDtoMapper.toDto(q));
    const totalPages = Math.ceil(total / query.limit) || 1;
    return {
      items: quoteItems,
      total,
      page: query.page,
      limit: query.limit,
      totalPages,
    };
  }
}
