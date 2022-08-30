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
import {Solution} from '../models';
import {SolutionRepository} from '../repositories';
import {PingController} from './ping.controller';

export class SolutionController {
  constructor(
    @repository(SolutionRepository)
    public solutionRepository: SolutionRepository,
    @inject('controllers.PingController')
    public pingController: PingController
  ) { }

  @post('/solutions')
  @response(200, {
    description: 'Solution model instance',
    content: {'application/json': {schema: getModelSchemaRef(Solution)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solution, {
            title: 'NewSolution',
            exclude: ['id', "agents"],
          }),
        },
      },
    })
    solution: Omit<Solution, 'id'>,
  ): Promise<Solution> {
    console.log(solution)
    return this.solutionRepository.create(solution);
  }

  @get('/solutions/count')
  @response(200, {
    description: 'Solution model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Solution) where?: Where<Solution>,
  ): Promise<Count> {
    return this.solutionRepository.count(where);
  }

  @get('/solutions')
  @response(200, {
    description: 'Array of Solution model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Solution, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Solution) filter?: Filter<Solution>,
  ): Promise<Solution[]> {
    return this.solutionRepository.find(filter);
  }

  @patch('/solutions')
  @response(200, {
    description: 'Solution PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solution, {partial: true}),
        },
      },
    })
    solution: Solution,
    @param.where(Solution) where?: Where<Solution>,
  ): Promise<Count> {
    return this.solutionRepository.updateAll(solution, where);
  }

  @get('/solutions/{id}')
  @response(200, {
    description: 'Solution model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Solution, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Solution, {exclude: 'where'}) filter?: FilterExcludingWhere<Solution>
  ): Promise<Solution> {
    return this.solutionRepository.findById(id, filter);
  }

  @patch('/solutions/{id}')
  @response(204, {
    description: 'Solution PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solution, {partial: true}),
        },
      },
    })
    solution: Solution,
  ): Promise<void> {
    await this.solutionRepository.updateById(id, solution);
  }

  @put('/solutions/{id}')
  @response(204, {
    description: 'Solution PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() solution: Solution,
  ): Promise<void> {
    await this.solutionRepository.replaceById(id, solution);
  }

  @del('/solutions/{id}')
  @response(204, {
    description: 'Solution DELETE success',
  })
  async deleteById(@param.path.number("id") id: number): Promise<void> {
    await this.solutionRepository.deleteById(id);
  }
}
