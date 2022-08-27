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
  Agent,
  Solution,
} from '../models';
import {AgentRepository} from '../repositories';

export class AgentSolutionController {
  constructor(
    @repository(AgentRepository) protected agentRepository: AgentRepository,
  ) { }

  @get('/agents/{id}/solutions', {
    responses: {
      '200': {
        description: 'Array of Agent has many Solution',
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
    return this.agentRepository.solutions(id).find(filter);
  }

  @post('/agents/{id}/solutions', {
    responses: {
      '200': {
        description: 'Agent model instance',
        content: {'application/json': {schema: getModelSchemaRef(Solution)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Agent.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solution, {
            title: 'NewSolutionInAgent',
            exclude: ['id'],
            optional: ['agentId']
          }),
        },
      },
    }) solution: Omit<Solution, 'id'>,
  ): Promise<Solution> {
    return this.agentRepository.solutions(id).create(solution);
  }

  @patch('/agents/{id}/solutions', {
    responses: {
      '200': {
        description: 'Agent.Solution PATCH success count',
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
    return this.agentRepository.solutions(id).patch(solution, where);
  }

  @del('/agents/{id}/solutions', {
    responses: {
      '200': {
        description: 'Agent.Solution DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Solution)) where?: Where<Solution>,
  ): Promise<Count> {
    return this.agentRepository.solutions(id).delete(where);
  }
}
