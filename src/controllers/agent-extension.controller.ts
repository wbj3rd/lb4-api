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
  Extension,
} from '../models';
import {AgentRepository} from '../repositories';

export class AgentExtensionController {
  constructor(
    @repository(AgentRepository) protected agentRepository: AgentRepository,
  ) { }

  @get('/agents/{id}/extension', {
    responses: {
      '200': {
        description: 'Agent has one Extension',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Extension),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Extension>,
  ): Promise<Extension> {
    return this.agentRepository.extension(id).get(filter);
  }

  @post('/agents/{id}/extension', {
    responses: {
      '200': {
        description: 'Agent model instance',
        content: {'application/json': {schema: getModelSchemaRef(Extension)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Agent.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Extension, {
            title: 'NewExtensionInAgent',
            exclude: ['id'],
            optional: ['agentId']
          }),
        },
      },
    }) extension: Omit<Extension, 'id'>,
  ): Promise<Extension> {
    return this.agentRepository.extension(id).create(extension);
  }

  @patch('/agents/{id}/extension', {
    responses: {
      '200': {
        description: 'Agent.Extension PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Extension, {partial: true}),
        },
      },
    })
    extension: Partial<Extension>,
    @param.query.object('where', getWhereSchemaFor(Extension)) where?: Where<Extension>,
  ): Promise<Count> {
    return this.agentRepository.extension(id).patch(extension, where);
  }

  @del('/agents/{id}/extension', {
    responses: {
      '200': {
        description: 'Agent.Extension DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Extension)) where?: Where<Extension>,
  ): Promise<Count> {
    return this.agentRepository.extension(id).delete(where);
  }
}
