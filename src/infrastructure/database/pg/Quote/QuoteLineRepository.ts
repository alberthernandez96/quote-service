import type { Pool, PoolClient } from 'pg';
import type { QuoteLineRecord } from './QuoteLineRecord';

type Queryable = Pool | PoolClient;

export class QuoteLineRepository {
  protected readonly tableName = 'quote_lines';
  protected readonly columns: (keyof QuoteLineRecord & string)[] = [
    'id',
    'quote_id',
    'type',
    'product_id',
    'quantity',
    'unit_price',
    'product_name',
    'comment',
    'position',
  ];

  constructor(protected readonly pool: Pool) {}

  private query(queryable: Queryable, text: string, values?: unknown[]) {
    return queryable.query(text, values);
  }

  async findByQuoteId(quoteId: number): Promise<QuoteLineRecord[]> {
    const cols = this.columns.join(', ');
    const result = await this.query(
      this.pool,
      `SELECT ${cols} FROM ${this.tableName}
       WHERE quote_id = $1
       ORDER BY position ASC, id ASC`,
      [quoteId]
    );
    return result.rows as QuoteLineRecord[];
  }

  async findByQuoteIds(quoteIds: number[]): Promise<QuoteLineRecord[]> {
    if (quoteIds.length === 0) return [];
    const cols = this.columns.join(', ');
    const placeholders = quoteIds.map((_, i) => `$${i + 1}`).join(', ');
    const result = await this.query(
      this.pool,
      `SELECT ${cols} FROM ${this.tableName}
       WHERE quote_id IN (${placeholders})
       ORDER BY quote_id, position ASC, id ASC`,
      quoteIds
    );
    return result.rows as QuoteLineRecord[];
  }

  async insertMany(records: QuoteLineRecord[], client?: PoolClient): Promise<void> {
    if (records.length === 0) return;
    const queryable = client ?? this.pool;
    const colList = this.columns.join(', ');
    const placeholders = this.columns.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO ${this.tableName} (${colList}) VALUES (${placeholders})`;

    for (const r of records) {
      const values = this.columns.map((c) => r[c as keyof QuoteLineRecord] ?? null);
      await this.query(queryable, query, values);
    }
  }

  async deleteByQuoteId(quoteId: number, client?: PoolClient): Promise<void> {
    const queryable = client ?? this.pool;
    await this.query(queryable, `DELETE FROM ${this.tableName} WHERE quote_id = $1`, [quoteId]);
  }
}
