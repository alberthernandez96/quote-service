import type { QuoteCreateDTO, QuoteDTO } from '@albertoficial/api-contracts';
import type { QuoteEntity, QuoteCreateEntity } from '@domain';

export class QuoteDtoMapper {
  static fromCreateDto(dto: QuoteCreateDTO): QuoteCreateEntity {
    return {
      clientId: dto.clientId,
      lines: dto.lines,
      status: dto.status,
      vat: dto.vat,
      dateInit: dto.dateInit,
      dateEnd: dto.dateEnd,
      reference: dto.reference,
    };
  }

  static toDto(entity: QuoteEntity): QuoteDTO {
    return {
      id: entity.getId(),
      clientId: entity.getClientId(),
      lines: entity.getLines(),
      status: entity.getStatus(),
      vat: entity.getVat(),
      dateInit: entity.getDateInit(),
      dateEnd: entity.getDateEnd(),
      reference: entity.getReference(),
      createdAt: entity.getCreatedAt().toISOString(),
      updatedAt: entity.getUpdatedAt()?.toISOString(),
      updatedBy: entity.getUpdatedBy(),
    };
  }
}
