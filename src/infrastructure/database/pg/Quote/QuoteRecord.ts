export interface QuoteRecord {
  id: number;
  client_id: string;
  status: string;
  vat: number;
  date_init: Date;
  date_end: Date;
  reference?: string;
  created_at: Date;
  updated_at?: Date;
  updated_by?: string;
}
