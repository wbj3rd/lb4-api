import {model, property} from '@loopback/repository';
import {User} from './user.model';


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
