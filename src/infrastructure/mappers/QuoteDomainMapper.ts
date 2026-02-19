import { v4 as uuidv4 } from 'uuid';
import { QuoteEntity, type QuoteEntityState } from '@domain';
import type { QuoteRecord, QuoteRecordWithLines, QuoteLineRecord } from '../database';

export class QuoteDomainMapper {
  static toDatabase(entity: QuoteEntity): { quote: QuoteRecord; lines: QuoteLineRecord[] } {
    const entityId = entity.getId();
    const quote: QuoteRecord = {
      id: entityId ?? undefined,
      client_id: entity.getClientId(),
      status: entity.getStatus(),
      vat: entity.getVat(),
      date_init: entity.getDateInit(),
      date_end: entity.getDateEnd(),
      reference: entity.getReference(),
      created_at: entity.getCreatedAt(),
      updated_at: entity.getUpdatedAt(),
      updated_by: entity.getUpdatedBy(),
    };
    const lines: QuoteLineRecord[] = entity.getLines().map((line, position) => ({
      id: uuidv4(),
      quote_id: entityId ?? 0,
      type: line.type,
      product_id: line.productId,
      quantity: line.quantity,
      unit_price: line.unitPrice,
      product_name: line.productName,
      position,
    }));
    return { quote, lines };
  }

  static fromDatabase(record: QuoteRecordWithLines): QuoteEntity {
    const state: QuoteEntityState = {
      id: record.id!,
      clientId: record.client_id,
      lines: record.lines.map((l) => ({
        id: l.id,
        type: l.type,
        productId: l.product_id,
        quantity: l.quantity,
        unitPrice: l.unit_price,
        productName: l.product_name,
        position: l.position,
      })),
      status: record.status,
      vat: record.vat,
      dateInit: record.date_init,
      dateEnd: record.date_end,
      reference: record.reference,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      updatedBy: record.updated_by,
    };
    return QuoteEntity.rehydrate(state);
  }
}
