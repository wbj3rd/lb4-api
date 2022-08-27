import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Client,
  Solution,
} from '../models';
import {ClientRepository} from '../repositories';

export class ClientSolutionController {
  constructor(
    @repository(ClientRepository) protected clientRepository: ClientRepository,
  ) { }

  @get('/clients/{id}/solutions', {
    responses: {
      '200': {
        description: 'Array of Client has many Solution',
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
    return this.clientRepository.solutions(id).find(filter);
  }

  @post('/clients/{id}/solutions', {
    responses: {
      '200': {
        description: 'Client model instance',
        content: {'application/json': {schema: getModelSchemaRef(Solution)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Client.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solution, {
            title: 'NewSolutionInClient',
            exclude: ['id'],
            optional: ['clientId']
          }),
        },
      },
    }) solution: Omit<Solution, 'id'>,
  ): Promise<Solution> {
    return this.clientRepository.solutions(id).create(solution);
  }

  @patch('/clients/{id}/solutions', {
    responses: {
      '200': {
        description: 'Client.Solution PATCH success count',
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
    return this.clientRepository.solutions(id).patch(solution, where);
  }

  @del('/clients/{id}/solutions', {
    responses: {
      '200': {
        description: 'Client.Solution DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Solution)) where?: Where<Solution>,
  ): Promise<Count> {
    return this.clientRepository.solutions(id).delete(where);
  }
}
