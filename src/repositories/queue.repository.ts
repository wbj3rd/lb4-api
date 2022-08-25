import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Queue, QueueRelations} from '../models';

export class QueueRepository extends DefaultCrudRepository<
  Queue,
  typeof Queue.prototype.id,
  QueueRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Queue, dataSource);
  }
}
