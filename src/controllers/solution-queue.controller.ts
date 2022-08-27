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

  @get('/solutions/{id}/queues', {
    responses: {
      '200': {
        description: 'Array of Solution has many Queue',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Queue)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Queue>,
  ): Promise<Queue[]> {
    return this.solutionRepository.queues(id).find(filter);
  }

  @post('/solutions/{id}/queues', {
    responses: {
      '200': {
        description: 'Solution model instance',
        content: {'application/json': {schema: getModelSchemaRef(Queue)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Solution.prototype.id,
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
    return this.solutionRepository.queues(id).create(queue);
  }

  @patch('/solutions/{id}/queues', {
    responses: {
      '200': {
        description: 'Solution.Queue PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
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
    return this.solutionRepository.queues(id).patch(queue, where);
  }

  @del('/solutions/{id}/queues', {
    responses: {
      '200': {
        description: 'Solution.Queue DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Queue)) where?: Where<Queue>,
  ): Promise<Count> {
    return this.solutionRepository.queues(id).delete(where);
  }
}
