import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {User} from './user.model';

@model({
  name: 'user_credentials',
})
export class UserCredentials extends BaseEntity {
  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @belongsTo(
    () => User,
    {name: 'user_id'},
    {
      name: 'user_id',
      required: true,
    },
  )
  userId: string;

  @property({
    type: 'string',
    required: true,
    name: 'auth_provider',
  })
  authProvider: string;

  @property({
    type: 'string',
    name: 'auth_id',
  })
  authId?: string;

  @property({
    type: 'string',
    name: 'auth_token',
  })
  authToken?: string;

  @property({
    type: 'string',
  })
  password?: string;

  constructor(data?: Partial<UserCredentials>) {
    super(data);
  }
}

export interface UserCredentialsRelations {

}

export type UserCredentialsWithRelations = UserCredentials &
  UserCredentialsRelations;
