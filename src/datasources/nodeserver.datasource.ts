import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'nodeserver',
  connector: 'rest',
  baseURL: 'http://localhost:3500',
  crud: false,
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  },
  operations: [
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3500',
      },
      functions: {
        getGreeting: [],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://localhost:3500/add/user',
        headers: {
          accept: "application/json"
        },
        query: {},
        body: {
          user: "{user}"
        },
      },
      functions: {
        addUser: ["user"],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://localhost:3500/add/queue',
        body: {
          queue: "{queue}"
        },
      },
      functions: {
        addQUeue: ["queue"],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://localhost:3500/add/music',
        body: {
          music: "{music}"
        },
      },
      functions: {
        addMusic: ["music"],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://localhost:3500/add/incoming',
        body: {
          incoming: "{incoming}"
        },
      },
      functions: {
        addIncoming: ["incoming"],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://localhost:3500/add/agent/to/queue',
        body: {
          agent: "{agent}",
          queue: "{queue}"
        },
      },
      functions: {
        addAgentToQueue: ["agent", "queue"],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://localhost:3500/agent/change/number',
        body: {
          number: "{number}",
          id: "{id}"
        },
      },
      functions: {
        addUser: ["number", "id"],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://localhost:3500/client/change/queue',
        body: {
          queue: "{queue}",
          clientId: "{clientId}"
        },
      },
      functions: {
        addUser: ["queue", "clientId"],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://localhost:3500/client/change/music',
        body: {
          client: "{client}",
          music: "{music}",
          queue: "{queue}",
        },
      },
      functions: {
        clientChangeMusic: ["client", "music", "queue"],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://localhost:3500/client/change/agents/queue',
        body: {
          client: "{client}",
          queue: "{queue}",
          agent: "{agent}"
        },
      },
      functions: {
        clientChangeAgentQueue: ["agent", "queue", "client"],
      },
    },
  ]
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class NodeserverDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'nodeserver';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.nodeserver', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
