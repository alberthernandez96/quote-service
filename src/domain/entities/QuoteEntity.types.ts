import { z } from 'zod';
import { QuoteErrorMessages } from '../errors/QuoteError';

const QuoteLineSchema = z.object({
  id: z.string().uuid(),
  type: z.string().max(50),
  productId: z.string().uuid(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().nonnegative(),
  productName: z.string().max(200).optional(),
  comment: z.string().max(500).optional(),
  position: z.number().int().min(0),
});

const QuoteSchema = z.object({
  id: z.number().int(),
  clientId: z.string().min(1, QuoteErrorMessages.CLIENT_ID_REQUIRED).max(20),
  lines: z.array(QuoteLineSchema).min(1, QuoteErrorMessages.LINES_REQUIRED),
  status: z.string().max(50),
  vat: z.number().min(0).max(100),
  dateInit: z.string(),
  dateEnd: z.string(),
  reference: z.string().max(100).optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
});


export type QuoteEntityState = z.infer<typeof QuoteSchema>;
