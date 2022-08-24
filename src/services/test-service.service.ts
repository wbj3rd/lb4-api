import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {TestRemoteDataSource} from '../datasources';

export interface TestService {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
}

export class TestServiceProvider implements Provider<TestService> {
  constructor(
    // testRemote must match the name property in the datasource json file
    @inject('datasources.testRemote')
    protected dataSource: TestRemoteDataSource = new TestRemoteDataSource(),
  ) {}

  value(): Promise<TestService> {
    return getService(this.dataSource);
  }
}
