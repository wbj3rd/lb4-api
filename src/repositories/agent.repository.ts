import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';

import {Extension, Solution} from '../models';
import {Agent, AgentRelations} from '../models/agent.model';
import {Client} from '../models/client.model';
import {ClientRepository} from './client.repository';
import {ExtensionRepository} from './extension.repository';
import {SolutionRepository} from './solution.repository';

export class AgentRepository extends DefaultCrudRepository<
  Agent,
  typeof Agent.prototype.id,
  AgentRelations
> {

  public readonly solutions: HasManyRepositoryFactory<Solution, typeof Agent.prototype.id>;

  public readonly extension: HasOneRepositoryFactory<Extension, typeof Agent.prototype.id>;

  public readonly clients: HasManyThroughRepositoryFactory<Client, typeof Client.prototype.id,
    Solution,
    typeof Agent.prototype.id
  >;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('SolutionRepository') protected solutionRepositoryGetter: Getter<SolutionRepository>, @repository.getter('ExtensionRepository') protected extensionRepositoryGetter: Getter<ExtensionRepository>, @repository.getter('ClientRepository') protected clientRepositoryGetter: Getter<ClientRepository>,
  ) {
    super(Agent, dataSource);
    this.clients = this.createHasManyThroughRepositoryFactoryFor('clients', clientRepositoryGetter, solutionRepositoryGetter,);
    this.registerInclusionResolver('clients', this.clients.inclusionResolver);
    this.extension = this.createHasOneRepositoryFactoryFor('extension', extensionRepositoryGetter);
    this.registerInclusionResolver('extension', this.extension.inclusionResolver);
    this.solutions = this.createHasManyRepositoryFactoryFor('solutions', solutionRepositoryGetter,);
    this.registerInclusionResolver('solutions', this.solutions.inclusionResolver);
  }
}
