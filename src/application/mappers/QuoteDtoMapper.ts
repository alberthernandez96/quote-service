import type {
  QuoteRequestDTO,
  QuoteResponseDTO,
} from "@albertoficial/api-contracts";
import type { QuoteEntity, QuoteEntityState } from "@domain";

export class QuoteDtoMapper {
  static fromDto(dto: QuoteRequestDTO, createdBy: string): QuoteEntityState {
    return {
      ...dto,
      lines: dto.lines.map((line, position) => ({
        ...line,
        position,
      })),
      createdBy,
    };
  }

  static toDto(entity: QuoteEntity): QuoteResponseDTO {
    return {
      id: entity.getId(),
      clientId: entity.getClientId(),
      lines: entity.getLines(),
      status: entity.getStatus(),
      vat: entity.getVat(),
      dateInit: entity.getDateInit(),
      dateEnd: entity.getDateEnd(),
      createdAt: entity.getCreatedAt(),
      reference: entity.getReference(),
      location: entity.getLocation(),
      coordinates: entity.getCoordinates(),
      extraLocation: entity.getExtraLocation(),
      percentageDiscount: entity.getPercentageDiscount(),
    };
  }
}
