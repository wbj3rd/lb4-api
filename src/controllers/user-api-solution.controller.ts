import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Solution, UserApi
} from '../models';
import {UserApiRepository} from '../repositories';

export class UserApiSolutionController {
  constructor(
    @repository(UserApiRepository) protected userApiRepository: UserApiRepository,
  ) { }

  @get('/user-apis/{id}/solutions', {
    responses: {
      '200': {
        description: 'Array of UserApi has many Solution',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Solution)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Solution>,
  ): Promise<Solution[]> {
    return this.userApiRepository.solutions(id).find(filter);
  }

  @post('/user-apis/{id}/solutions', {
    responses: {
      '200': {
        description: 'UserApi model instance',
        content: {'application/json': {schema: getModelSchemaRef(Solution)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof UserApi.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solution, {
            title: 'NewSolutionInUserApi',
            exclude: ['id'],
            optional: ['userApiId']
          }),
        },
      },
    }) solution: Omit<Solution, 'id'>,
  ): Promise<Solution> {
    return this.userApiRepository.solutions(id).create(solution);
  }

  @patch('/user-apis/{id}/solutions', {
    responses: {
      '200': {
        description: 'UserApi.Solution PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solution, {partial: true}),
        },
      },
    })
    solution: Partial<Solution>,
    @param.query.object('where', getWhereSchemaFor(Solution)) where?: Where<Solution>,
  ): Promise<Count> {
    return this.userApiRepository.solutions(id).patch(solution, where);
  }

  @del('/user-apis/{id}/solutions', {
    responses: {
      '200': {
        description: 'UserApi.Solution DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Solution)) where?: Where<Solution>,
  ): Promise<Count> {
    return this.userApiRepository.solutions(id).delete(where);
  }
}
