import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {PhoneNumber} from 'twilio/lib/interfaces';

import {NodeserverDataSource} from '../datasources';
import {Queue} from '../models';
import {User} from '../models/user.model';

export interface solution {
  agent: User
  queue: Queue;
}
export interface NodeService {
  getGreeting: any;
  addUser<User>(user: User): User;
  addQueue<Queue>(queue: Queue): Queue;
  addMusic<Music>(music: Music): Music;
  addIncoming<Incoming>(phone_number: PhoneNumber): Incoming;
  addAgentToQueue<Agent, Queue>(agent: User, queue: Queue): solution;
  agentChangeNumber<User>(user: User): User;
  clientChangeQueue<Queue>(queue: Queue): Queue;
  clientChangeMusic<Music>(music: Music, queue: Queue): Music;
  clientChangeAgents<Agent>(queue: Queue, agent: User): Agent;
  deactivateAgent<Agent>(): void;
  deactivateQueue<Agent>(): void;

  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
}

export class NodeServiceProvider implements Provider<NodeService> {
  constructor(
    // nodeserver must match the name property in the datasource json file
    @inject('datasources.nodeserver')
    protected dataSource: NodeserverDataSource = new NodeserverDataSource(),
  ) { }

  value(): Promise<NodeService> {
    return getService(this.dataSource);
  }
}
