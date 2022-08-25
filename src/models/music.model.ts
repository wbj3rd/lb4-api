import {model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';


@model({settings: {strict: false}})
export class Music extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  link: string;

  @property({
    type: 'string',
  })
  codec?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Music>) {
    super(data);
  }
}

export interface MusicRelations {
  // describe navigational properties here
}

export type MusicWithRelations = Music & MusicRelations;
