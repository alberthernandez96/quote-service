export const QUOTE_SCHEMA = `
CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  client_id VARCHAR(20) NOT NULL,
  status VARCHAR(50),
  vat NUMERIC(5,2),
  date_init VARCHAR(50),
  date_end VARCHAR(50),
  reference VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  updated_by VARCHAR(255)
);
CREATE INDEX IF NOT EXISTS idx_quotes_id ON quotes (id);
CREATE INDEX IF NOT EXISTS idx_quotes_client_id ON quotes (client_id);
`;

export const QUOTE_LINES_SCHEMA = `
CREATE TABLE IF NOT EXISTS quote_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  type VARCHAR(50),
  comment VARCHAR(500),

  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  product_name VARCHAR(200),
  position INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_quote_lines_quote_id ON quote_lines (quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_lines_product_id ON quote_lines (product_id);
`;
