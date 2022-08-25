import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Extension, ExtensionRelations} from '../models';

export class ExtensionRepository extends DefaultCrudRepository<
  Extension,
  typeof Extension.prototype.id,
  ExtensionRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Extension, dataSource);
  }
}
