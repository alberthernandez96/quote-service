import { Request, Response } from "express";
import {
  getQuoteQuerySchema,
  QuoteQueryResponseDTO,
  QuoteResponseDTO,
} from "@albertoficial/api-contracts";
import { QueryBus } from "@albertoficial/backend-shared";
import {
  GetLastRegistryQuery,
  GetQuoteQuery,
  GetQuoteListQuery,
} from "@application";
import { ErrorHandler } from "@presentation";

export class QuoteQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  async get(req: Request, res: Response<QuoteResponseDTO>): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.queryBus.execute<QuoteResponseDTO>(
        new GetQuoteQuery(
          Number(id),
          undefined,
          req.headers["x-correlation-id"] as string,
        ),
      );
      res.status(200).json(result);
    } catch (error: unknown) {
      ErrorHandler.handle(error, res, "QuoteQueryController.get");
    }
  }

  async getLastRegistry(
    req: Request,
    res: Response<QuoteResponseDTO>,
  ): Promise<void> {
    try {
      const result = await this.queryBus.execute<QuoteResponseDTO>(
        new GetLastRegistryQuery(
          undefined,
          req.headers["x-correlation-id"] as string,
        ),
      );
      res.status(200).json(result);
    } catch (error: unknown) {
      ErrorHandler.handle(error, res, "QuoteQueryController.getLastRegistry");
    }
  }

  async getAll(
    req: Request,
    res: Response<QuoteQueryResponseDTO>,
  ): Promise<void> {
    try {
      const { page, limit } = getQuoteQuerySchema.parse(req.query);
      const result = await this.queryBus.execute<QuoteQueryResponseDTO>(
        new GetQuoteListQuery(
          page,
          limit,
          undefined,
          req.headers["x-correlation-id"] as string,
        ),
      );
      res.status(200).json(result);
    } catch (error: unknown) {
      ErrorHandler.handle(error, res, "QuoteQueryController.getAll");
    }
  }
}
