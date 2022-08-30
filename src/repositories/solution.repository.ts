import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Solution, SolutionRelations, Queue, PhoneNumber, Agent} from '../models';
import {QueueRepository} from './queue.repository';
import {PhoneNumberRepository} from './phone-number.repository';
import {AgentRepository} from './agent.repository';

export class SolutionRepository extends DefaultCrudRepository<
  Solution,
  typeof Solution.prototype.id,
  SolutionRelations
> {

  public readonly queues: HasManyRepositoryFactory<Queue, typeof Solution.prototype.id>;

  public readonly phoneNumbers: HasManyRepositoryFactory<PhoneNumber, typeof Solution.prototype.id>;

  public readonly agents: HasManyRepositoryFactory<Agent, typeof Solution.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('QueueRepository') protected queueRepositoryGetter: Getter<QueueRepository>, @repository.getter('PhoneNumberRepository') protected phoneNumberRepositoryGetter: Getter<PhoneNumberRepository>, @repository.getter('AgentRepository') protected agentRepositoryGetter: Getter<AgentRepository>,
  ) {
    super(Solution, dataSource);
    this.agents = this.createHasManyRepositoryFactoryFor('agents', agentRepositoryGetter,);
    this.registerInclusionResolver('agents', this.agents.inclusionResolver);
    this.phoneNumbers = this.createHasManyRepositoryFactoryFor('phoneNumbers', phoneNumberRepositoryGetter,);
    this.registerInclusionResolver('phoneNumbers', this.phoneNumbers.inclusionResolver);
    this.queues = this.createHasManyRepositoryFactoryFor('queues', queueRepositoryGetter,);
    this.registerInclusionResolver('queues', this.queues.inclusionResolver);
  }
}
