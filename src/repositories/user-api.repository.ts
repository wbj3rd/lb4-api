import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {UserApi, UserApiRelations, Solution} from '../models';
import {SolutionRepository} from './solution.repository';

export class UserApiRepository extends DefaultCrudRepository<
  UserApi,
  typeof UserApi.prototype.id,
  UserApiRelations
> {

  public readonly solutions: HasManyRepositoryFactory<Solution, typeof UserApi.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('SolutionRepository') protected solutionRepositoryGetter: Getter<SolutionRepository>,
  ) {
    super(UserApi, dataSource);
    this.solutions = this.createHasManyRepositoryFactoryFor('solutions', solutionRepositoryGetter,);
    this.registerInclusionResolver('solutions', this.solutions.inclusionResolver);
  }
}
