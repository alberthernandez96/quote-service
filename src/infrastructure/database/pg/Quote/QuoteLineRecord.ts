export interface QuoteLineRecord {
  id: string;
  quote_id: number;
  type?: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product_name?: string;
  position: number;
}
