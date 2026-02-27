import { v4 as uuidv4 } from "uuid";
import { QuoteEntity, type QuoteEntityState } from "@domain";
import type { QuoteRecord } from "../database";

export class QuoteDomainMapper {
  static toDatabase(entity: QuoteEntity): QuoteRecord {
    return {
      id: entity.getId(),
      client_id: entity.getClientId(),
      status: entity.getStatus(),
      vat: entity.getVat(),
      date_init: entity.getDateInit()
        ? new Date(entity.getDateInit()!)
        : undefined,
      date_end: entity.getDateEnd()
        ? new Date(entity.getDateEnd()!)
        : undefined,
      lines: entity.getLines().map((line, position) => ({
        id: uuidv4(),
        quote_id: entity.getId(),
        product_id: line.productId,
        unit_price: line.unitPrice,
        quantity: line.quantity,
        type: line.type,
        comment: line.comment,
        position,
      })),
      reference: entity.getReference(),
      location: entity.getLocation(),
      coordinates: entity.getCoordinates(),
      extra_location: entity.getExtraLocation(),
      percentage_discount: entity.getPercentageDiscount(),
      created_at: new Date(entity.getCreatedAt()),
      created_by: entity.getCreatedBy(),
      updated_at: entity.getUpdatedAt()
        ? new Date(entity.getUpdatedAt()!)
        : undefined,
      updated_by: entity.getUpdatedBy() ?? undefined,
    };
  }

  static fromDatabase(record: QuoteRecord): QuoteEntity {
    const state: QuoteEntityState = {
      id: record.id,
      status: record.status,
      vat: record.vat,
      lines: record.lines.map((line) => ({
        productId: line.product_id,
        unitPrice: line.unit_price,
        quantity: line.quantity,
        position: line.position,
        comment: line.comment,
        type: line.type,
        id: line.id,
      })),
      reference: record.reference,
      location: record.location,
      coordinates: record.coordinates,
      extraLocation: record.extra_location,
      percentageDiscount: record.percentage_discount,
      clientId: record.client_id,
      dateInit: record.date_init?.toISOString(),
      dateEnd: record.date_end?.toISOString(),
      createdAt: record.created_at?.toISOString(),
      createdBy: record.created_by,
      updatedAt: record.updated_at?.toISOString(),
      updatedBy: record.updated_by,
    };
    return QuoteEntity.rehydrate(state);
  }
}
