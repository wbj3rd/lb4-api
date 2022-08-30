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
  Solution,
  Agent,
} from '../models';
import {SolutionRepository} from '../repositories';

export class SolutionAgentController {
  constructor(
    @repository(SolutionRepository) protected solutionRepository: SolutionRepository,
  ) { }

  @get('/solutions/{id}/agents', {
    responses: {
      '200': {
        description: 'Array of Solution has many Agent',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Agent)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Agent>,
  ): Promise<Agent[]> {
    return this.solutionRepository.agents(id).find(filter);
  }

  @post('/solutions/{id}/agents', {
    responses: {
      '200': {
        description: 'Solution model instance',
        content: {'application/json': {schema: getModelSchemaRef(Agent)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Solution.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agent, {
            title: 'NewAgentInSolution',
            exclude: ['id'],
            optional: ['solutionId']
          }),
        },
      },
    }) agent: Omit<Agent, 'id'>,
  ): Promise<Agent> {
    return this.solutionRepository.agents(id).create(agent);
  }

  @patch('/solutions/{id}/agents', {
    responses: {
      '200': {
        description: 'Solution.Agent PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agent, {partial: true}),
        },
      },
    })
    agent: Partial<Agent>,
    @param.query.object('where', getWhereSchemaFor(Agent)) where?: Where<Agent>,
  ): Promise<Count> {
    return this.solutionRepository.agents(id).patch(agent, where);
  }

  @del('/solutions/{id}/agents', {
    responses: {
      '200': {
        description: 'Solution.Agent DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Agent)) where?: Where<Agent>,
  ): Promise<Count> {
    return this.solutionRepository.agents(id).delete(where);
  }
}
