import {model, property, hasMany} from '@loopback/repository';
import {User} from './user.model';
import {Solution} from './solution.model';

@model({settings: {strict: false}})
export class UserApi extends User {


  @property({
    type: 'string',
    required: true,
  })
  clientId: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  roles?: string[];

  @hasMany(() => Solution)
  solutions: Solution[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserApi>) {
    super(data);
  }
}

export interface UserApiRelations {
  // describe navigational properties here
}

export type UserApiWithRelations = UserApi & UserApiRelations;
