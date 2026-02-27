import type {
  QuoteEntityState,
  QuoteLineEntityState,
} from "./QuoteEntity.types";

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
      location: props.location,
      coordinates: props.coordinates,
      extraLocation: props.extraLocation,
      percentageDiscount: props.percentageDiscount,
      reference: props.reference,
      createdAt: now.toISOString(),
      createdBy: props.createdBy,
      updatedAt: now.toISOString(),
      updatedBy: props.updatedBy,
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

  getLines(): QuoteLineEntityState[] {
    return this.state.lines;
  }

  getStatus(): string {
    return this.state.status;
  }

  getVat(): number {
    return this.state.vat;
  }

  getLocation(): string | undefined {
    return this.state.location;
  }

  getCoordinates(): { lat: number; lng: number } | undefined {
    return this.state.coordinates;
  }

  getExtraLocation(): number | undefined {
    return this.state.extraLocation;
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
  getPercentageDiscount(): number | undefined {
    return this.state.percentageDiscount;
  }

  getCreatedAt(): string {
    return this.state.createdAt;
  }
  getCreatedBy(): string {
    return this.state.createdBy;
  }

  getUpdatedAt(): string | undefined {
    return this.state.updatedAt;
  }

  getUpdatedBy(): string | undefined {
    return this.state.updatedBy;
  }
}
