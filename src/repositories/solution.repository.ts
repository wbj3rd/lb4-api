import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, ReferencesManyAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Solution, SolutionRelations, Agent, PhoneNumber, Music, Queue} from '../models';
import {AgentRepository} from './agent.repository';
import {PhoneNumberRepository} from './phone-number.repository';
import {MusicRepository} from './music.repository';
import {QueueRepository} from './queue.repository';

export class SolutionRepository extends DefaultCrudRepository<
  Solution,
  typeof Solution.prototype.id,
  SolutionRelations
> {

  public readonly agents: ReferencesManyAccessor<Agent, typeof Solution.prototype.id>;

  public readonly phoneNumber: HasOneRepositoryFactory<PhoneNumber, typeof Solution.prototype.id>;

  public readonly music: HasOneRepositoryFactory<Music, typeof Solution.prototype.id>;

  public readonly queue: HasOneRepositoryFactory<Queue, typeof Solution.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('AgentRepository') protected agentRepositoryGetter: Getter<AgentRepository>, @repository.getter('PhoneNumberRepository') protected phoneNumberRepositoryGetter: Getter<PhoneNumberRepository>, @repository.getter('MusicRepository') protected musicRepositoryGetter: Getter<MusicRepository>, @repository.getter('QueueRepository') protected queueRepositoryGetter: Getter<QueueRepository>,
  ) {
    super(Solution, dataSource);
    this.queue = this.createHasOneRepositoryFactoryFor('queue', queueRepositoryGetter);
    this.registerInclusionResolver('queue', this.queue.inclusionResolver);
    this.music = this.createHasOneRepositoryFactoryFor('music', musicRepositoryGetter);
    this.registerInclusionResolver('music', this.music.inclusionResolver);
    this.phoneNumber = this.createHasOneRepositoryFactoryFor('phoneNumber', phoneNumberRepositoryGetter);
    this.registerInclusionResolver('phoneNumber', this.phoneNumber.inclusionResolver);
    this.agents = this.createReferencesManyAccessorFor('agents', agentRepositoryGetter,);
    this.registerInclusionResolver('agents', this.agents.inclusionResolver);
  }
}
