import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from './user-modifiable-entity.model';


@model({settings: {strict: false}})
export class Queue extends UserModifiableEntity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  solutionId: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Queue>) {
    super(data);
  }
}

export interface QueueRelations {
  // describe navigational properties here
}

export type QueueWithRelations = Queue & QueueRelations;
