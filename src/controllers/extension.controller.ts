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
import {Extension} from '../models';
import {ExtensionRepository} from '../repositories';

export class ExtensionController {
  constructor(
    @repository(ExtensionRepository)
    public extensionRepository: ExtensionRepository,
  ) { }

  @post('/extensions')
  @response(200, {
    description: 'Extension model instance',
    content: {'application/json': {schema: getModelSchemaRef(Extension)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Extension, {
            title: 'NewExtension',
            exclude: ['id'],
          }),
        },
      },
    })
    extension: Omit<Extension, 'id'>,
  ): Promise<Extension> {
    return this.extensionRepository.create(extension);
  }

  @get('/extensions/count')
  @response(200, {
    description: 'Extension model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Extension) where?: Where<Extension>,
  ): Promise<Count> {
    return this.extensionRepository.count(where);
  }

  @get('/extensions')
  @response(200, {
    description: 'Array of Extension model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Extension, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Extension) filter?: Filter<Extension>,
  ): Promise<Extension[]> {
    return this.extensionRepository.find(filter);
  }

  @patch('/extensions')
  @response(200, {
    description: 'Extension PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Extension, {partial: true}),
        },
      },
    })
    extension: Extension,
    @param.where(Extension) where?: Where<Extension>,
  ): Promise<Count> {
    return this.extensionRepository.updateAll(extension, where);
  }

  @get('/extensions/{id}')
  @response(200, {
    description: 'Extension model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Extension, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Extension, {exclude: 'where'}) filter?: FilterExcludingWhere<Extension>
  ): Promise<Extension> {
    return this.extensionRepository.findById(id, filter);
  }

  @patch('/extensions/{id}')
  @response(204, {
    description: 'Extension PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Extension, {partial: true}),
        },
      },
    })
    extension: Extension,
  ): Promise<void> {
    await this.extensionRepository.updateById(id, extension);
  }

  @put('/extensions/{id}')
  @response(204, {
    description: 'Extension PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() extension: Extension,
  ): Promise<void> {
    await this.extensionRepository.replaceById(id, extension);
  }

  @del('/extensions/{id}')
  @response(204, {
    description: 'Extension DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.extensionRepository.deleteById(id);
  }
}
