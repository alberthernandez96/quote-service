import type { QuoteEntity } from '@domain';
import type { IQuoteRepository } from '@application';
import { QuoteRepository } from '../database';
import { QuoteDomainMapper } from '../mappers';

export class QuoteRepositoryAdapter implements IQuoteRepository {
  constructor(private readonly postgresRepo: QuoteRepository) {}

  async findById(id: string): Promise<QuoteEntity | null> {
    const record = await this.postgresRepo.findById(id);
    return record ? QuoteDomainMapper.fromDatabase(record) : null;
  }

  async save(quote: QuoteEntity): Promise<void> {
    const { quote: quoteRecord, lines } = QuoteDomainMapper.toDatabase(quote);
    await this.postgresRepo.save(quoteRecord, lines);
  }

  async update(quote: QuoteEntity): Promise<void> {
    const { quote: quoteRecord, lines } = QuoteDomainMapper.toDatabase(quote);
    await this.postgresRepo.save(quoteRecord, lines);
  }

  async list(limit: number, offset: number): Promise<{ items: QuoteEntity[]; total: number }> {
    const { rows, total } = await this.postgresRepo.list(limit, offset);
    return {
      items: rows.map((r) => QuoteDomainMapper.fromDatabase(r)),
      total,
    };
  }

  async delete(id: string): Promise<void> {
    await this.postgresRepo.delete(id);
  }
}
