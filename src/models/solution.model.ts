import {hasMany, model, property} from '@loopback/repository';
import {Agent} from './agent.model';
import {PhoneNumber} from './phone-number.model';
import {Queue} from './queue.model';
import {UserModifiableEntity} from './user-modifiable-entity.model';

@model({settings: {strict: false}})
export class Solution extends UserModifiableEntity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',

  })
  queueId: number;

  @property({
    type: 'number',

  })
  phoneId: number;
  @property({
    type: 'number',
  })
  music?: number;



  @hasMany(() => Queue)
  queues: Queue[];

  @hasMany(() => PhoneNumber)
  phoneNumbers: PhoneNumber[];

  @property({
    type: "number",
  })
  clientId?: number;

  @property({
    type: 'string',
  })
  agentId?: string;

  @hasMany(() => Agent)
  agents: Agent[];
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
