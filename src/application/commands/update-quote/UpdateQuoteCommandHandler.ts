import { CommandHandler } from '@albertoficial/backend-shared';
import { QuoteEntity, QuoteIdMismatchError, QuoteNotFoundError, type QuoteEntityState } from '@domain';
import { QuoteDtoMapper, UpdateQuoteCommand, IQuoteRepository } from '@application';

export class UpdateQuoteCommandHandler implements CommandHandler<UpdateQuoteCommand, unknown> {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async handle(command: UpdateQuoteCommand): Promise<unknown> {
    return command.executeWithTracing(async (cmd) => {
      const existing = await this.quoteRepository.findById(cmd.id);
      if (!existing) {
        throw new QuoteNotFoundError(cmd.id);
      }

      if (existing.getId() !== cmd.data.id) {
        throw new QuoteIdMismatchError(cmd.id, cmd.data.id);
      }

      const data = cmd.data;
      const quoteMapped = QuoteDtoMapper.fromDto(data);
      const newLines = quoteMapped.lines; // Are comming all. 
      console.log('newLines', newLines);

      const state: QuoteEntityState = {
        ...quoteMapped,
        lines: newLines,
        updatedAt: new Date().toISOString(),
        updatedBy: cmd.updatedBy,
      };

      const quote = QuoteEntity.rehydrate(state);
      await this.quoteRepository.update(quote);

      return QuoteDtoMapper.toDto(quote);
    });
  }
}
