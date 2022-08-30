import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from './user-modifiable-entity.model';


@model({settings: {strict: false}})
export class Extension extends UserModifiableEntity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  asteriskId: string;

  @property({
    type: 'number',
    required: true,
  })
  agentId: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Extension>) {
    super(data);
  }
}

export interface ExtensionRelations {
  // describe navigational properties here
}

export type ExtensionWithRelations = Extension & ExtensionRelations;
