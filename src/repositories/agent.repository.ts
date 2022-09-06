import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Agent, AgentRelations, Extension} from '../models';
import {ExtensionRepository} from './extension.repository';

export class AgentRepository extends DefaultCrudRepository<
  Agent,
  typeof Agent.prototype.id,
  AgentRelations
> {

  public readonly extension: HasOneRepositoryFactory<Extension, typeof Agent.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('ExtensionRepository') protected extensionRepositoryGetter: Getter<ExtensionRepository>,
  ) {
    super(Agent, dataSource);
    this.extension = this.createHasOneRepositoryFactoryFor('extension', extensionRepositoryGetter);
    this.registerInclusionResolver('extension', this.extension.inclusionResolver);
  }
}
