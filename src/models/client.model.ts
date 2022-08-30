import {hasMany, model, property} from '@loopback/repository';

import {Agent} from './agent.model';
import {Solution} from './solution.model';
import {User} from './user.model';

@model({settings: {strict: false}})
export class Client extends User {

  @hasMany(() => Solution)
  solutions: Solution[];

  @hasMany(() => Agent, {through: {model: () => Solution}})
  agents: Agent[];
  // Define well-known properties here
  @property({
    type: 'string',
    required: true,
    name: 'name',
  })
  name: string;
  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Client>) {
    super(data);
  }
}

export interface ClientRelations {
  // describe navigational properties here
}

export type ClientWithRelations = Client & ClientRelations;
