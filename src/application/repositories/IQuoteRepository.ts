import { QuoteEntity } from '@domain';

export interface IQuoteRepository {
  findById(id: string): Promise<QuoteEntity | null>;
  findLastRegistry(): Promise<QuoteEntity | null>;
  save(quote: QuoteEntity): Promise<number>;
  update(quote: QuoteEntity): Promise<void>;
  list(limit: number, offset: number): Promise<{ items: QuoteEntity[]; total: number }>;
  delete(id: string): Promise<void>;
}
