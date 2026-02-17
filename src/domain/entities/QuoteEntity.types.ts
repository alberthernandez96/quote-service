import { z } from 'zod';
import { QuoteErrorMessages } from '../errors/QuoteError';

const QuoteLineSchema = z.object({
  id: z.string().uuid(),
  type: z.string().max(50).optional(),
  productId: z.string().uuid(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().nonnegative(),
  productName: z.string().max(200).optional(),
  comment: z.string().max(500).optional(),
  position: z.number().int().min(0),
});

const QuoteSchema = z.object({
  id: z.number().int().nullable(),
  clientId: z.string().min(1, QuoteErrorMessages.CLIENT_ID_REQUIRED).max(20),
  lines: z.array(QuoteLineSchema).min(1, QuoteErrorMessages.LINES_REQUIRED),
  status: z.string().max(50).optional(),
  vat: z.number().min(0).max(100).optional(),
  dateInit: z.string().optional(),
  dateEnd: z.string().optional(),
  reference: z.string().max(100).optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  updatedBy: z.string().optional(),
});

export const QuoteCreatePropsSchema = QuoteSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updatedBy: true,
});

export type QuoteEntityState = z.infer<typeof QuoteSchema>;
export type QuoteCreateEntity = z.infer<typeof QuoteCreatePropsSchema>;
