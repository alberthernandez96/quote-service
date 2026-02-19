import { QueryHandler } from '@albertoficial/backend-shared';
import { QuoteDtoMapper, GetQuoteListQuery, IQuoteRepository } from '@application';

export class GetQuoteListQueryHandler implements QueryHandler<GetQuoteListQuery, unknown> {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async handle(query: GetQuoteListQuery): Promise<unknown> {
    return query.executeWithTracing(async (qry) => {
      const { items, total } = await this.quoteRepository.list(qry.limit, (qry.page - 1) * qry.limit);
      const quoteItems = items.map((q) => QuoteDtoMapper.toDto(q));
      const totalPages = Math.ceil(total / qry.limit) || 1;

      return {
        items: quoteItems,
        total,
        page: qry.page,
        limit: qry.limit,
        totalPages,
      };
    });
  }
}
