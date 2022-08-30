import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from './user-modifiable-entity.model';


@model({settings: {strict: false}})
export class PhoneNumber extends UserModifiableEntity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  phone_number: string;

  @property({
    type: 'string',
  })
  twilioId?: string;

  @property({
    type: 'number',
  })
  solutionId?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PhoneNumber>) {
    super(data);
  }
}

export interface PhoneNumberRelations {
  // describe navigational properties here
}

export type PhoneNumberWithRelations = PhoneNumber & PhoneNumberRelations;
