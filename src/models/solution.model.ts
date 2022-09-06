import {hasOne, model, property, referencesMany} from '@loopback/repository';
import {Agent} from './agent.model';
import {Music} from './music.model';
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
    type: 'string',

  })
  name: string;


  @property({
    type: "number",
  })
  clientId?: number;



  @referencesMany(() => Agent)
  agentIds: number[];

  @hasOne(() => PhoneNumber)
  phoneNumber: PhoneNumber;

  @hasOne(() => Music)
  music: Music;

  @hasOne(() => Queue)
  queue: Queue;
  //@hasMany(() => Agent)
  //agents: Agent[];
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
