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
  PhoneNumber, Solution
} from '../models';
import {SolutionRepository} from '../repositories';

export class SolutionPhoneNumberController {
  constructor(
    @repository(SolutionRepository) protected solutionRepository: SolutionRepository,
  ) { }

  @get('/solutions/{id}/phone-numbers', {
    responses: {
      '200': {
        description: 'Array of Solution has many PhoneNumber',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PhoneNumber)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<PhoneNumber>,
  ): Promise<PhoneNumber[]> {
    return this.solutionRepository.phoneNumbers(id).find(filter);
  }

  @post('/solutions/{id}/phone-numbers', {
    responses: {
      '200': {
        description: 'Solution model instance',
        content: {'application/json': {schema: getModelSchemaRef(PhoneNumber)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Solution.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PhoneNumber, {
            title: 'NewPhoneNumberInSolution',
            exclude: ['id'],
            optional: ['solutionId']
          }),
        },
      },
    }) phoneNumber: Omit<PhoneNumber, 'id'>,
  ): Promise<PhoneNumber> {
    return this.solutionRepository.phoneNumbers(id).create(phoneNumber);
  }

  @patch('/solutions/{id}/phone-numbers', {
    responses: {
      '200': {
        description: 'Solution.PhoneNumber PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PhoneNumber, {partial: true}),
        },
      },
    })
    phoneNumber: Partial<PhoneNumber>,
    @param.query.object('where', getWhereSchemaFor(PhoneNumber)) where?: Where<PhoneNumber>,
  ): Promise<Count> {
    return this.solutionRepository.phoneNumbers(id).patch(phoneNumber, where);
  }

  @del('/solutions/{id}/phone-numbers', {
    responses: {
      '200': {
        description: 'Solution.PhoneNumber DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(PhoneNumber)) where?: Where<PhoneNumber>,
  ): Promise<Count> {
    return this.solutionRepository.phoneNumbers(id).delete(where);
  }
}
