import { v4 as uuidv4 } from 'uuid';
import type { QuoteEntityState, QuoteCreateEntity } from './QuoteEntity.types';

export class QuoteEntity {
  private readonly state: QuoteEntityState;

  private constructor(state: QuoteEntityState) {
    this.state = state;
  }

  static create(props: QuoteCreateEntity): QuoteEntity {
    const now = new Date();
    const state: QuoteEntityState = {
      id: null,
      clientId: props.clientId,
      lines: props.lines,
      status: props.status,
      vat: props.vat,
      dateInit: props.dateInit,
      dateEnd: props.dateEnd,
      reference: props.reference,
      createdAt: now,
      updatedAt: undefined,
      updatedBy: undefined,
    };
    return new QuoteEntity(state);
  }

  static rehydrate(state: QuoteEntityState): QuoteEntity {
    return new QuoteEntity(state);
  }

  getId(): number | null {
    return this.state.id;
  }

  getClientId(): string {
    return this.state.clientId;
  }

  getLines() {
    return this.state.lines;
  }

  getStatus(): string | undefined {
    return this.state.status;
  }

  getVat(): number | undefined {
    return this.state.vat;
  }

  getDateInit(): string | undefined {
    return this.state.dateInit;
  }

  getDateEnd(): string | undefined {
    return this.state.dateEnd;
  }

  getReference(): string | undefined {
    return this.state.reference;
  }

  getCreatedAt(): Date {
    return this.state.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.state.updatedAt;
  }

  getUpdatedBy(): string | undefined {
    return this.state.updatedBy;
  }
}
