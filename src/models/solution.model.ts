import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from './user-modifiable-entity.model';


@model({settings: {strict: false}})
export class Solution extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  queueId: string;

  @property({
    type: 'string',
    required: true,
  })
  phoneId: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  agents: string[];

  @property({
    type: 'string',
  })
  music?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Solution>) {
    super(data);
  }
}

export interface SolutionRelations {
  // describe navigational properties here
}

export type SolutionWithRelations = Solution & SolutionRelations;
