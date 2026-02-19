import { CommandHandler } from '@albertoficial/backend-shared';
import { QuoteEntity } from '@domain';
import { QuoteDtoMapper, CreateQuoteCommand, IQuoteRepository } from '@application';

export class CreateQuoteCommandHandler implements CommandHandler<CreateQuoteCommand, unknown> {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async handle(command: CreateQuoteCommand): Promise<unknown> {
    return command.executeWithTracing(async (cmd) => {
      const props = QuoteDtoMapper.fromCreateDto(cmd.data);
      const quote = QuoteEntity.create(props);
      const quoteId = await this.quoteRepository.save(quote);
      
      // Recargar la entidad con el ID generado
      const savedQuote = await this.quoteRepository.findById(String(quoteId));
      if (!savedQuote) {
        throw new Error('Failed to retrieve saved quote');
      }

      return QuoteDtoMapper.toDto(savedQuote);
    });
  }
}
