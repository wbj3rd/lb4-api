import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';

import {NodeserverDataSource} from '../datasources';
import {Queue} from '../models';
import {User} from '../models/user.model';

export interface solution {
  agent: User
  queue: Queue;
}
export interface NodeService {
  getGreeting: any;
  addUser<User>(): User;
  addQueue<Queue>(): Queue;
  addMusic<Music>(): Music;
  addIncoming<Incoming>(): Incoming;
  addAgentToQueue<Agent, Queue>(): solution;
  agentChangeNumber<PhoneNumber>(): PhoneNumber;
  clientChangeQueue<Queue>(): Queue;
  clientChangeMusic<Music>(): Music;
  clientChangeAgents<Agent>(): Agent;

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
