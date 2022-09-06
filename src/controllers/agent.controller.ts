import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Agent} from '../models';
import {AgentRepository} from '../repositories';
import {PingController} from './ping.controller';
export class AgentController {
  constructor(
    @repository(AgentRepository)
    public agentRepository: AgentRepository,
    @inject('controllers.PingController')
    public pingController: PingController
  ) { }

  @post('/agents')
  @response(200, {
    description: 'Agent model instance',
    content: {'application/json': {schema: getModelSchemaRef(Agent)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agent, {
            title: 'NewAgent',
            exclude: ['id'],
          }),
        },
      },
    })
    agent: Omit<Agent, 'id'>,
  ): Promise<Agent> {
    //send agent to asterisk server
    console.log(agent)
    let result = await this.agentRepository.create(agent)
    result.fname = result.firstName;
    result.lname = result.lastName
    result.cell = result.phone
    const body = {
      user: result,
    };
    await this.pingController.createAgent(body)
    console.log(result)
    return result;
  }

  @get('/agents/count')
  @response(200, {
    description: 'Agent model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Agent) where?: Where<Agent>,
  ): Promise<Count> {
    return this.agentRepository.count(where);
  }

  @get('/agents')
  @response(200, {
    description: 'Array of Agent model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Agent, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Agent) filter?: Filter<Agent>,
  ): Promise<Agent[]> {
    return this.agentRepository.find(filter);
  }

  @patch('/agents')
  @response(200, {
    description: 'Agent PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agent, {partial: true}),
        },
      },
    })
    agent: Agent,
    @param.where(Agent) where?: Where<Agent>,
  ): Promise<Count> {
    return this.agentRepository.updateAll(agent, where);
  }

  @get('/agents/{id}')
  @response(200, {
    description: 'Agent model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Agent, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Agent, {exclude: 'where'}) filter?: FilterExcludingWhere<Agent>
  ): Promise<Agent> {
    return this.agentRepository.findById(id, filter);
  }

  @patch('/agents/{id}')
  @response(204, {
    description: 'Agent PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agent, {partial: true}),
        },
      },
    })
    agent: Agent,
  ): Promise<void> {
    await this.agentRepository.updateById(id, agent);
  }

  @put('/agents/{id}')
  @response(204, {
    description: 'Agent PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() agent: Agent,
  ): Promise<void> {
    await this.agentRepository.replaceById(id, agent);
  }

  @del('/agents/{id}')
  @response(204, {
    description: 'Agent DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.agentRepository.deleteById(id);
  }
}
