import type { QuoteEntityState } from './QuoteEntity.types';

export class QuoteEntity {
  private readonly state: QuoteEntityState;

  private constructor(state: QuoteEntityState) {
    this.state = state;
  }

  static create(props: QuoteEntityState): QuoteEntity {
    const now = new Date();
    const state: QuoteEntityState = {
      id: props.id,
      clientId: props.clientId,
      lines: props.lines,
      status: props.status,
      vat: props.vat,
      dateInit: props.dateInit,
      dateEnd: props.dateEnd,
      reference: props.reference,
      createdAt: now.toISOString(),
    };
    return new QuoteEntity(state);
  }

  static rehydrate(state: QuoteEntityState): QuoteEntity {
    return new QuoteEntity(state);
  }

  getId(): number {
    return this.state.id;
  }

  getClientId(): string {
    return this.state.clientId;
  }

  getLines() {
    return this.state.lines;
  }

  getStatus(): string {
    return this.state.status;
  }

  getVat(): number {
    return this.state.vat;
  }

  getDateInit(): string {
    return this.state.dateInit;
  }

  getDateEnd(): string {
    return this.state.dateEnd;
  }

  getReference(): string | undefined {
    return this.state.reference;
  }

  getCreatedAt(): string {
    return this.state.createdAt;
  }

  getUpdatedAt(): string | undefined {
    return this.state.updatedAt;
  }

  getUpdatedBy(): string | undefined {
    return this.state.updatedBy;
  }
}
