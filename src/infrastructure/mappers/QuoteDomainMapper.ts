import { v4 as uuidv4 } from 'uuid';
import { QuoteEntity, type QuoteEntityState } from '@domain';
import type { QuoteRecord, QuoteRecordWithLines, QuoteLineRecord } from '../database';

export class QuoteDomainMapper {
  static toDatabase(entity: QuoteEntity): { quote: QuoteRecord; lines: QuoteLineRecord[] } {
    const entityId = entity.getId();
    const quote: QuoteRecord = {
      id: entityId,
      client_id: entity.getClientId(),
      status: entity.getStatus(),
      vat: entity.getVat(),
      date_init: new Date(entity.getDateInit()),
      date_end: new Date(entity.getDateEnd()),
      reference: entity.getReference(),
      created_at: new Date(entity.getCreatedAt()),
      updated_at: entity.getUpdatedAt() ? new Date(entity.getUpdatedAt()!) : undefined,
      updated_by: entity.getUpdatedBy() ?? undefined,
    };
    const lines: QuoteLineRecord[] = entity.getLines().map((line, position) => ({
      ...line,
      id: uuidv4(),
      product_id: line.productId,
      unit_price: line.unitPrice,
      product_name: line.productName,
      position,
    }));
    return { quote, lines };
  }

  static fromDatabase(record: QuoteRecordWithLines): QuoteEntity {
    const state: QuoteEntityState = {
      ...record,
      lines: record.lines.map((l) => ({
        ...l,
        productId: l.product_id,
        unitPrice: l.unit_price,
        productName: l.product_name,
      })),
      clientId: record.client_id,
      dateInit: record.date_init.toISOString(),
      dateEnd: record.date_end.toISOString(),
      createdAt: record.created_at.toISOString(),
      updatedAt: record.updated_at?.toISOString(),
    };
    return QuoteEntity.rehydrate(state);
  }
}
