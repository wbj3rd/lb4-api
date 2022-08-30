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
  Agent, Client
} from '../models';
import {ClientRepository} from '../repositories';

export class ClientAgentController {
  constructor(
    @repository(ClientRepository) protected clientRepository: ClientRepository,
  ) { }

  @get('/clients/{id}/agents', {
    responses: {
      '200': {
        description: 'Array of Client has many Agent through Solution',
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
    return this.clientRepository.agents(id).find(filter);
  }

  @post('/clients/{id}/agents', {
    responses: {
      '200': {
        description: 'create a Agent model instance',
        content: {'application/json': {schema: getModelSchemaRef(Agent)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Client.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agent, {
            title: 'NewAgentInClient',
            exclude: ['id'],
          }),
        },
      },
    }) agent: Omit<Agent, 'id'>,
  ): Promise<Agent> {
    return this.clientRepository.agents(id).create(agent);
  }

  @patch('/clients/{id}/agents', {
    responses: {
      '200': {
        description: 'Client.Agent PATCH success count',
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
    return this.clientRepository.agents(id).patch(agent, where);
  }

  @del('/clients/{id}/agents', {
    responses: {
      '200': {
        description: 'Client.Agent DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Agent)) where?: Where<Agent>,
  ): Promise<Count> {
    return this.clientRepository.agents(id).delete(where);
  }
}
