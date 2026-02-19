import { v4 as uuidv4 } from 'uuid';
import { CommandHandler } from '@albertoficial/backend-shared';
import { QuoteEntity, QuoteNotFoundError, type QuoteEntityState } from '@domain';
import { QuoteDtoMapper, UpdateQuoteCommand, IQuoteRepository } from '@application';

export class UpdateQuoteCommandHandler implements CommandHandler<UpdateQuoteCommand, unknown> {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async handle(command: UpdateQuoteCommand): Promise<unknown> {
    return command.executeWithTracing(async (cmd) => {
      const existing = await this.quoteRepository.findById(cmd.id);
      if (!existing) {
        throw new QuoteNotFoundError(cmd.id);
      }

      const existingId = existing.getId();
      if (existingId == null) {
        throw new QuoteNotFoundError(cmd.id);
      }

      const { data } = cmd;
      const existingLines = existing.getLines();

      const lines =
        data.lines === undefined
          ? existingLines
          : data.lines.map((line, position) => ({
              id: existingLines[position]?.id ?? uuidv4(),
              type: line.type,
              productId: line.productId,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              productName: line.productName,
              position,
            }));

      const state: QuoteEntityState = {
        id: existingId,
        clientId: data.clientId ?? existing.getClientId(),
        lines,
        status: data.status ?? existing.getStatus(),
        vat: data.vat ?? existing.getVat(),
        dateInit: data.dateInit ?? existing.getDateInit(),
        dateEnd: data.dateEnd ?? existing.getDateEnd(),
        reference: data.reference ?? existing.getReference(),
        createdAt: existing.getCreatedAt(),
        updatedAt: new Date(),
        updatedBy: cmd.updatedBy ?? existing.getUpdatedBy(),
      };

      const quote = QuoteEntity.rehydrate(state);
      await this.quoteRepository.update(quote);

      return QuoteDtoMapper.toDto(quote);
    });
  }
}
