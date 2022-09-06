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
  Music,
} from '../models';
import {SolutionRepository} from '../repositories';

export class SolutionMusicController {
  constructor(
    @repository(SolutionRepository) protected solutionRepository: SolutionRepository,
  ) { }

  @get('/solutions/{id}/music', {
    responses: {
      '200': {
        description: 'Solution has one Music',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Music),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Music>,
  ): Promise<Music> {
    return this.solutionRepository.music(id).get(filter);
  }

  @post('/solutions/{id}/music', {
    responses: {
      '200': {
        description: 'Solution model instance',
        content: {'application/json': {schema: getModelSchemaRef(Music)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Solution.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Music, {
            title: 'NewMusicInSolution',
            exclude: ['id'],
            optional: ['solutionId']
          }),
        },
      },
    }) music: Omit<Music, 'id'>,
  ): Promise<Music> {
    return this.solutionRepository.music(id).create(music);
  }

  @patch('/solutions/{id}/music', {
    responses: {
      '200': {
        description: 'Solution.Music PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Music, {partial: true}),
        },
      },
    })
    music: Partial<Music>,
    @param.query.object('where', getWhereSchemaFor(Music)) where?: Where<Music>,
  ): Promise<Count> {
    return this.solutionRepository.music(id).patch(music, where);
  }

  @del('/solutions/{id}/music', {
    responses: {
      '200': {
        description: 'Solution.Music DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Music)) where?: Where<Music>,
  ): Promise<Count> {
    return this.solutionRepository.music(id).delete(where);
  }
}
