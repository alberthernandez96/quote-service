import { CommandHandler } from "@albertoficial/backend-shared";
import {
  QuoteCreatedByRequiredError,
  QuoteEntity,
  QuoteIdMismatchError,
  QuoteNotFoundError,
  type QuoteEntityState,
} from "@domain";
import {
  QuoteDtoMapper,
  UpdateQuoteCommand,
  IQuoteRepository,
} from "@application";

export class UpdateQuoteCommandHandler implements CommandHandler<
  UpdateQuoteCommand,
  unknown
> {
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

      if (!cmd.updatedBy) {
        throw new QuoteCreatedByRequiredError();
      }

      const quoteMapped = QuoteDtoMapper.fromDto(cmd.data, cmd.updatedBy);
      const newLines = quoteMapped.lines;

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
