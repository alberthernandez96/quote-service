export interface QuoteRecord {
  id?: number;
  client_id: string;
  status?: string;
  vat?: number;
  date_init?: string;
  date_end?: string;
  reference?: string;
  created_at: Date;
  updated_at?: Date;
  updated_by?: string;
}
