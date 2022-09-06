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
  PhoneNumber,
} from '../models';
import {SolutionRepository} from '../repositories';

export class SolutionPhoneNumberController {
  constructor(
    @repository(SolutionRepository) protected solutionRepository: SolutionRepository,
  ) { }

  @get('/solutions/{id}/phone-number', {
    responses: {
      '200': {
        description: 'Solution has one PhoneNumber',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PhoneNumber),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<PhoneNumber>,
  ): Promise<PhoneNumber> {
    return this.solutionRepository.phoneNumber(id).get(filter);
  }

  @post('/solutions/{id}/phone-number', {
    responses: {
      '200': {
        description: 'Solution model instance',
        content: {'application/json': {schema: getModelSchemaRef(PhoneNumber)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Solution.prototype.id,
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
    return this.solutionRepository.phoneNumber(id).create(phoneNumber);
  }

  @patch('/solutions/{id}/phone-number', {
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
    return this.solutionRepository.phoneNumber(id).patch(phoneNumber, where);
  }

  @del('/solutions/{id}/phone-number', {
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
    return this.solutionRepository.phoneNumber(id).delete(where);
  }
}
