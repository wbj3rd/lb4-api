import {hasMany, hasOne, model, property} from '@loopback/repository';

import {Client} from './client.model';
import {Extension} from './extension.model';
import {Solution} from './solution.model';
import {User} from './user.model';

@model({settings: {strict: false}})
export class Agent extends User {

  @hasMany(() => Solution)
  solutions: Solution[];

  @hasOne(() => Extension)
  extension: Extension;

  @hasMany(() => Client, {through: {model: () => Solution}})
  clients: Client[];

  @property({
    type: 'number',
  })
  solutionId?: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Agent>) {
    super(data);
  }
}

export interface AgentRelations {
  // describe navigational properties here
}

export type AgentWithRelations = Agent & AgentRelations;
