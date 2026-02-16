import { v4 as uuidv4 } from 'uuid';
import { Query } from '@albertoficial/backend-shared';

export class GetQuoteQuery implements Query {
  readonly queryId = uuidv4();
  readonly createdAt = new Date();
  readonly createdBy?: string;
  readonly correlationId?: string;

  constructor(
    readonly id: string,
    createdBy?: string,
    correlationId?: string
  ) {
    this.createdBy = createdBy;
    this.correlationId = correlationId;
  }
}
