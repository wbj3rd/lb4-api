import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {PhoneNumber, PhoneNumberRelations} from '../models';

export class PhoneNumberRepository extends DefaultCrudRepository<
  PhoneNumber,
  typeof PhoneNumber.prototype.id,
  PhoneNumberRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(PhoneNumber, dataSource);
  }
}
