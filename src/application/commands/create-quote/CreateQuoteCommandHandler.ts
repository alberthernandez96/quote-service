import { CommandHandler } from '@albertoficial/backend-shared';
import { QuoteEntity } from '@domain';
import { QuoteDtoMapper, CreateQuoteCommand, IQuoteRepository } from '@application';

export class CreateQuoteCommandHandler implements CommandHandler<CreateQuoteCommand, unknown> {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async handle(command: CreateQuoteCommand): Promise<unknown> {
    const props = QuoteDtoMapper.fromCreateDto(command.data);
    const quote = QuoteEntity.create(props);
    await this.quoteRepository.save(quote);
    return QuoteDtoMapper.toDto(quote);
  }
}
