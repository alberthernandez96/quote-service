import type { QuoteEntity } from "@domain";
import type { IQuoteRepository } from "@application";
import { QuoteRepository } from "../database";
import { QuoteDomainMapper } from "../mappers";

export class QuoteRepositoryAdapter implements IQuoteRepository {
  constructor(private readonly postgresRepo: QuoteRepository) {}

  async findById(id: number): Promise<QuoteEntity | null> {
    const record = await this.postgresRepo.findById(id);
    return record ? QuoteDomainMapper.fromDatabase(record) : null;
  }

  async findLastRegistry(): Promise<QuoteEntity | null> {
    const record = await this.postgresRepo.findLastRegistry();
    return record ? QuoteDomainMapper.fromDatabase(record) : null;
  }

  async save(quote: QuoteEntity): Promise<number> {
    const quoteRecord = QuoteDomainMapper.toDatabase(quote);
    return await this.postgresRepo.save(quoteRecord);
  }

  async update(quote: QuoteEntity): Promise<void> {
    const quoteRecord = QuoteDomainMapper.toDatabase(quote);
    await this.postgresRepo.save(quoteRecord);
  }

  async list(
    limit: number,
    offset: number,
  ): Promise<{ items: QuoteEntity[]; total: number }> {
    const { rows, total } = await this.postgresRepo.list(limit, offset);
    return {
      items: rows.map((r) => QuoteDomainMapper.fromDatabase(r)),
      total,
    };
  }

  async delete(id: number): Promise<void> {
    await this.postgresRepo.delete(id);
  }
}
