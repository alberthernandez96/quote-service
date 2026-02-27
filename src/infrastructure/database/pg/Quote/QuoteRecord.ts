import type { QuoteLineRecord } from "./QuoteLineRecord";

export interface QuoteRecord {
  id: number;
  client_id: string;
  status: string;
  vat: number;
  date_init?: Date;
  date_end?: Date;
  reference?: string;
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  extra_location?: number;
  percentage_discount?: number;
  lines: QuoteLineRecord[];
  created_at: Date;
  created_by: string;
  updated_at?: Date;
  updated_by?: string;
}
