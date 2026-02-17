import { v4 as uuidv4 } from 'uuid';
import type { QuoteCreateDTO, QuoteDTO } from '@albertoficial/api-contracts';
import type { QuoteEntity, QuoteCreateEntity } from '@domain';

export class QuoteDtoMapper {
  static fromCreateDto(dto: QuoteCreateDTO): QuoteCreateEntity {
    return {
      clientId: dto.clientId,
      lines: dto.lines.map((line, position) => ({
        id: uuidv4(),
        productId: line.productId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        productName: line.productName,
        comment: line.comment,
        position,
      })),
      status: dto.status,
      vat: dto.vat,
      dateInit: dto.dateInit,
      dateEnd: dto.dateEnd,
      reference: dto.reference,
    };
  }

  static toDto(entity: QuoteEntity): QuoteDTO {
    return {
      id: entity.getId() ?? 0,
      clientId: entity.getClientId(),
      lines: entity.getLines().map((line) => ({
        type: line.type,
        productId: line.productId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        productName: line.productName,
        comment: line.comment ?? '',
      })),
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
