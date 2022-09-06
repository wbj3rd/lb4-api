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
  Queue,
} from '../models';
import {SolutionRepository} from '../repositories';

export class SolutionQueueController {
  constructor(
    @repository(SolutionRepository) protected solutionRepository: SolutionRepository,
  ) { }

  @get('/solutions/{id}/queue', {
    responses: {
      '200': {
        description: 'Solution has one Queue',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Queue),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Queue>,
  ): Promise<Queue> {
    return this.solutionRepository.queue(id).get(filter);
  }

  @post('/solutions/{id}/queue', {
    responses: {
      '200': {
        description: 'Solution model instance',
        content: {'application/json': {schema: getModelSchemaRef(Queue)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Solution.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Queue, {
            title: 'NewQueueInSolution',
            exclude: ['id'],
            optional: ['solutionId']
          }),
        },
      },
    }) queue: Omit<Queue, 'id'>,
  ): Promise<Queue> {
    return this.solutionRepository.queue(id).create(queue);
  }

  @patch('/solutions/{id}/queue', {
    responses: {
      '200': {
        description: 'Solution.Queue PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Queue, {partial: true}),
        },
      },
    })
    queue: Partial<Queue>,
    @param.query.object('where', getWhereSchemaFor(Queue)) where?: Where<Queue>,
  ): Promise<Count> {
    return this.solutionRepository.queue(id).patch(queue, where);
  }

  @del('/solutions/{id}/queue', {
    responses: {
      '200': {
        description: 'Solution.Queue DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Queue)) where?: Where<Queue>,
  ): Promise<Count> {
    return this.solutionRepository.queue(id).delete(where);
  }
}
