import {inject} from '@loopback/core';
import {PostgresDataSource} from '../datasources';
import {AuthClient} from '../models/auth-clients.model';


import {DefaultSoftCrudRepository} from './default-soft-crud.repository.base';

export class AuthClientRepository extends DefaultSoftCrudRepository<
  AuthClient,
  typeof AuthClient.prototype.id
> {
  constructor(@inject('datasources.postgres') dataSource: PostgresDataSource) {
    super(AuthClient, dataSource);
  }
}
