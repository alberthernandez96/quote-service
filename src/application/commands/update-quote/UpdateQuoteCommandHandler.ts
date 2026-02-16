import { CommandHandler } from '@albertoficial/backend-shared';
import { QuoteEntity, QuoteNotFoundError, type QuoteEntityState } from '@domain';
import { QuoteDtoMapper, UpdateQuoteCommand, IQuoteRepository } from '@application';

export class UpdateQuoteCommandHandler implements CommandHandler<UpdateQuoteCommand, unknown> {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async handle(command: UpdateQuoteCommand): Promise<unknown> {
    const existing = await this.quoteRepository.findById(command.id);
    if (!existing) {
      throw new QuoteNotFoundError(command.id);
    }
    const state: QuoteEntityState = {
      id: existing.getId(),
      clientId: command.data.clientId ?? existing.getClientId(),
      lines: command.data.lines ?? existing.getLines(),
      status: command.data.status !== undefined ? command.data.status : existing.getStatus(),
      vat: command.data.vat !== undefined ? command.data.vat : existing.getVat(),
      dateInit: command.data.dateInit !== undefined ? command.data.dateInit : existing.getDateInit(),
      dateEnd: command.data.dateEnd !== undefined ? command.data.dateEnd : existing.getDateEnd(),
      reference: command.data.reference !== undefined ? command.data.reference : existing.getReference(),
      createdAt: existing.getCreatedAt(),
      updatedAt: new Date(),
      updatedBy: command.updatedBy,
    };
    const quote = QuoteEntity.rehydrate(state);
    await this.quoteRepository.update(quote);
    return QuoteDtoMapper.toDto(quote);
  }
}
