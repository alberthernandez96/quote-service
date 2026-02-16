import { Request, Response } from 'express';
import { CommandBus, AuthenticatedRequest } from '@albertoficial/backend-shared';
import { CreateQuoteCommand, UpdateQuoteCommand } from '@application';
import { ErrorHandler } from '@presentation';

export class QuoteCommandController {
  constructor(private readonly commandBus: CommandBus) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.commandBus.execute(
        new CreateQuoteCommand(
          req.body,
          (req as AuthenticatedRequest).user?.id,
          req.headers['x-correlation-id'] as string
        )
      );
      res.status(201).json(result);
    } catch (error: unknown) {
      ErrorHandler.handle(error, res, 'QuoteCommandController.create');
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.commandBus.execute(
        new UpdateQuoteCommand(
          id,
          req.body,
          (req as AuthenticatedRequest).user?.id,
          req.headers['x-correlation-id'] as string
        )
      );
      res.status(200).json(result);
    } catch (error: unknown) {
      ErrorHandler.handle(error, res, 'QuoteCommandController.update');
    }
  }
}
