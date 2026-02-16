import { Request, Response } from 'express';
import { QuoteDTO, QuoteListResponseDTO, getQuoteListQuerySchema } from '@albertoficial/api-contracts';
import { QueryBus } from '@albertoficial/backend-shared';
import { GetQuoteQuery, GetQuoteListQuery } from '@application';
import { ErrorHandler } from '@presentation';

export class QuoteQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  async get(req: Request, res: Response<QuoteDTO>): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.queryBus.execute<QuoteDTO>(
        new GetQuoteQuery(id, undefined, req.headers['x-correlation-id'] as string)
      );
      res.status(200).json(result);
    } catch (error: unknown) {
      ErrorHandler.handle(error, res, 'QuoteQueryController.get');
    }
  }

  async getAll(req: Request, res: Response<QuoteListResponseDTO>): Promise<void> {
    try {
      const { page, limit } = getQuoteListQuerySchema.parse(req.query);
      const result = await this.queryBus.execute<QuoteListResponseDTO>(
        new GetQuoteListQuery(page, limit, undefined, req.headers['x-correlation-id'] as string)
      );
      res.status(200).json(result);
    } catch (error: unknown) {
      ErrorHandler.handle(error, res, 'QuoteQueryController.getAll');
    }
  }
}
