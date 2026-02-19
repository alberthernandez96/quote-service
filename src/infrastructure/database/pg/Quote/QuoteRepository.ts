import type { Pool, PoolClient } from 'pg';
import { PostgresBaseRepository as BaseRepository } from '@albertoficial/postgres-shared';
import type { QuoteRecord } from './QuoteRecord';
import type { QuoteLineRecord } from './QuoteLineRecord';
import { QuoteLineRepository } from './QuoteLineRepository';

export interface QuoteRecordWithLines extends QuoteRecord {
  lines: QuoteLineRecord[];
}

export class QuoteRepository extends BaseRepository<QuoteRecord> {
  protected tableName = 'quotes';
  protected idColumn: keyof QuoteRecord & string = 'id';
  protected columns: (keyof QuoteRecord & string)[] = [
    'id',
    'client_id',
    'status',
    'vat',
    'date_init',
    'date_end',
    'reference',
    'created_at',
    'updated_at',
    'updated_by',
  ];

  private readonly lineRepo: QuoteLineRepository;

  constructor(pool: Pool) {
    super(pool);
    this.lineRepo = new QuoteLineRepository(pool);
  }

  async findById(id: string): Promise<QuoteRecordWithLines | null> {
    const quote = await this.getRecord(id);
    if (!quote) return null;
    const lines = await this.lineRepo.findByQuoteId(id);
    return { ...quote, lines };
  }

  async findLastRegistry(): Promise<QuoteRecordWithLines | null> {
    const cols = this.columns.join(', ');
    const result = await this.pool.query(
      `SELECT ${cols} FROM ${this.tableName} ORDER BY created_at DESC, id DESC LIMIT 1`
    );
    const quote = result.rows[0] as QuoteRecord | undefined;
    if (!quote?.id) return null;
    const lines = await this.lineRepo.findByQuoteId(String(quote.id));
    return { ...quote, lines };
  }

  async save(quote: QuoteRecord, lines: QuoteLineRecord[]): Promise<number> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const quoteId = await this.saveRecordWithClient(quote, client);
      await this.lineRepo.deleteByQuoteId(quoteId, client);
      const linesWithQuoteId = lines.map((l) => ({ ...l, quote_id: quoteId }));
      await this.lineRepo.insertMany(linesWithQuoteId, client);
      await client.query('COMMIT');
      return quoteId;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  private async saveRecordWithClient(record: QuoteRecord, client: PoolClient): Promise<number> {
    const hasId = record.id != null;

    if (hasId) {
      const cols = this.columns;
      const values = cols.map((c) => (record[c as keyof QuoteRecord] ?? null));
      const colList = cols.join(', ');
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
      const updateCols = cols.filter((c) => c !== this.idColumn);
      const assignments = updateCols.map((c) => `${c} = EXCLUDED.${c}`).join(', ');
      const query = `
        INSERT INTO ${this.tableName} (${colList})
        VALUES (${placeholders})
        ON CONFLICT (${this.idColumn}) DO UPDATE SET ${assignments}
      `;
      await client.query(query, values);
      return record.id!;
    }

    const insertCols = this.columns.filter((c) => c !== this.idColumn);
    const colList = insertCols.join(', ');
    const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(', ');
    const values = insertCols.map((c) => (record[c as keyof QuoteRecord] ?? null));
    const result = await client.query(
      `INSERT INTO ${this.tableName} (${colList}) VALUES (${placeholders}) RETURNING id`,
      values
    );
    const row = result.rows[0] as { id: number };
    return row.id;
  }

  async list(limit: number, offset: number): Promise<{ rows: QuoteRecordWithLines[]; total: number }> {
    const countResult = await this.pool.query(
      `SELECT COUNT(*)::int AS total FROM ${this.tableName}`
    );
    const total = (countResult.rows[0] as { total: number }).total;
    const cols = this.columns.join(', ');
    const result = await this.pool.query(
      `SELECT ${cols} FROM ${this.tableName} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const quotes = result.rows as QuoteRecord[];
    if (quotes.length === 0) return { rows: [], total };
    const quoteIds = quotes.map((q) => q.id!);
    const allLines = await this.lineRepo.findByQuoteIds(quoteIds);
    const linesByQuoteId = new Map<string, QuoteLineRecord[]>();
    for (const line of allLines) {
      const list = linesByQuoteId.get(String(line.quote_id)) ?? [];
      list.push(line);
      linesByQuoteId.set(String(line.quote_id), list);
    }
    const rows: QuoteRecordWithLines[] = quotes.map((q) => ({
      ...q,
      lines: linesByQuoteId.get(String(q.id)) ?? [],
    }));
    return { rows, total };
  }

  async delete(id: string): Promise<void> {
    await this.deleteRecord(id);
  }
}
