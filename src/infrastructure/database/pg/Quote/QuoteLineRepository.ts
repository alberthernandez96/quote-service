import type { Pool, PoolClient } from 'pg';
import type { QuoteLineRecord } from './QuoteLineRecord';

type Queryable = Pool | PoolClient;

export class QuoteLineRepository {
  private readonly tableName = 'quote_lines';

  constructor(private readonly pool: Pool) {}

  private query(queryable: Queryable, text: string, values?: unknown[]) {
    return queryable.query(text, values);
  }

  async findByQuoteId(quoteId: string): Promise<QuoteLineRecord[]> {
    const result = await this.query(
      this.pool,
      `SELECT id, quote_id, product_id, quantity, unit_price, product_name, position
       FROM ${this.tableName}
       WHERE quote_id = $1
       ORDER BY position ASC, id ASC`,
      [quoteId]
    );
    return result.rows as QuoteLineRecord[];
  }

  async findByQuoteIds(quoteIds: string[]): Promise<QuoteLineRecord[]> {
    if (quoteIds.length === 0) return [];
    const placeholders = quoteIds.map((_, i) => `$${i + 1}`).join(', ');
    const result = await this.query(
      this.pool,
      `SELECT id, quote_id, product_id, quantity, unit_price, product_name, position
       FROM ${this.tableName}
       WHERE quote_id IN (${placeholders})
       ORDER BY quote_id, position ASC, id ASC`,
      quoteIds
    );
    return result.rows as QuoteLineRecord[];
  }

  async insertMany(records: QuoteLineRecord[], client?: PoolClient): Promise<void> {
    if (records.length === 0) return;
    const queryable = client ?? this.pool;
    for (const r of records) {
      await this.query(
        queryable,
        `INSERT INTO ${this.tableName} (id, quote_id, product_id, quantity, unit_price, product_name, position)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [r.id, r.quote_id, r.product_id, r.quantity, r.unit_price, r.product_name ?? null, r.position]
      );
    }
  }

  async deleteByQuoteId(quoteId: string, client?: PoolClient): Promise<void> {
    const queryable = client ?? this.pool;
    await this.query(queryable, `DELETE FROM ${this.tableName} WHERE quote_id = $1`, [quoteId]);
  }
}
