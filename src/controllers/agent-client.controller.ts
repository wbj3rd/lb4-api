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

import {Agent} from '../models/agent.model';
import {Client} from '../models/client.model';
import {AgentRepository} from '../repositories/agent.repository';


export class AgentClientController {
  constructor(
    @repository(AgentRepository) protected agentRepository: AgentRepository,
  ) { }

  @get('/agents/{id}/clients', {
    responses: {
      '200': {
        description: 'Array of Agent has many Client through Solution',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Client)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Client>,
  ): Promise<Client[]> {
    return this.agentRepository.clients(id).find(filter);
  }

  @post('/agents/{id}/clients', {
    responses: {
      '200': {
        description: 'create a Client model instance',
        content: {'application/json': {schema: getModelSchemaRef(Client)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Agent.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {
            title: 'NewClientInAgent',
            exclude: ['id'],
          }),
        },
      },
    }) client: Omit<Client, 'id'>,
  ): Promise<Client> {
    return this.agentRepository.clients(id).create(client);
  }

  @patch('/agents/{id}/clients', {
    responses: {
      '200': {
        description: 'Agent.Client PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {partial: true}),
        },
      },
    })
    client: Partial<Client>,
    @param.query.object('where', getWhereSchemaFor(Client)) where?: Where<Client>,
  ): Promise<Count> {
    return this.agentRepository.clients(id).patch(client, where);
  }

  @del('/agents/{id}/clients', {
    responses: {
      '200': {
        description: 'Agent.Client DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Client)) where?: Where<Client>,
  ): Promise<Count> {
    return this.agentRepository.clients(id).delete(where);
  }
}
