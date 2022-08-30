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
import {PhoneNumber} from '../models';
import {PhoneNumberRepository} from '../repositories';

export class PhoneNumberController {
  constructor(
    @repository(PhoneNumberRepository)
    public phoneNumberRepository: PhoneNumberRepository,
  ) { }

  @post('/phone-numbers')
  @response(200, {
    description: 'PhoneNumber model instance',
    content: {'application/json': {schema: getModelSchemaRef(PhoneNumber)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PhoneNumber, {
            title: 'NewPhoneNumber',
            exclude: ['id'],
          }),
        },
      },
    })
    phoneNumber: Omit<PhoneNumber, 'id'>,
  ): Promise<PhoneNumber> {
    return this.phoneNumberRepository.create(phoneNumber);
  }

  @get('/phone-numbers/count')
  @response(200, {
    description: 'PhoneNumber model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PhoneNumber) where?: Where<PhoneNumber>,
  ): Promise<Count> {
    return this.phoneNumberRepository.count(where);
  }

  @get('/phone-numbers')
  @response(200, {
    description: 'Array of PhoneNumber model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PhoneNumber, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PhoneNumber) filter?: Filter<PhoneNumber>,
  ): Promise<PhoneNumber[]> {
    return this.phoneNumberRepository.find(filter);
  }

  @patch('/phone-numbers')
  @response(200, {
    description: 'PhoneNumber PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PhoneNumber, {partial: true}),
        },
      },
    })
    phoneNumber: PhoneNumber,
    @param.where(PhoneNumber) where?: Where<PhoneNumber>,
  ): Promise<Count> {
    return this.phoneNumberRepository.updateAll(phoneNumber, where);
  }

  @get('/phone-numbers/{id}')
  @response(200, {
    description: 'PhoneNumber model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PhoneNumber, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(PhoneNumber, {exclude: 'where'}) filter?: FilterExcludingWhere<PhoneNumber>
  ): Promise<PhoneNumber> {
    return this.phoneNumberRepository.findById(id, filter);
  }

  @patch('/phone-numbers/{id}')
  @response(204, {
    description: 'PhoneNumber PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PhoneNumber, {partial: true}),
        },
      },
    })
    phoneNumber: PhoneNumber,
  ): Promise<void> {
    await this.phoneNumberRepository.updateById(id, phoneNumber);
  }

  @put('/phone-numbers/{id}')
  @response(204, {
    description: 'PhoneNumber PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() phoneNumber: PhoneNumber,
  ): Promise<void> {
    await this.phoneNumberRepository.replaceById(id, phoneNumber);
  }

  @del('/phone-numbers/{id}')
  @response(204, {
    description: 'PhoneNumber DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.phoneNumberRepository.deleteById(id);
  }
}
