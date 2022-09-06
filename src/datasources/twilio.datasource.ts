import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import twilio = require("twilio")
const config = {
  name: 'twilio',
  connector: 'twilio',
  accountSid: 'AC59d932bc85de0cc648f471d3b88cd126',
  authToken: '5c8bd0de4aa2874798a9e9330e46f6ae'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class TwilioDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'twilio';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.twilio', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }


  public async availableNumbers() {
    const client = require('twilio')(config.accountSid, config.authToken);
    return await client.availablePhoneNumbers('US')
      .local
      .list({areaCode: 510, limit: 20})
      ;
  }
  public purchaseNumber(number: any) {
    const client = require('twilio')(config.accountSid, config.authToken);

    return client.incomingPhoneNumbers
      .create({phoneNumber: number})
      .then((incoming_phone_number: any) => console.log(incoming_phone_number.sid));
  }
  public sendText(from: string, to: string, body: string) {
    const client = require('twilio')(config.accountSid, config.authToken);
    return client.messages.create({
      from: from,
      to: to,
      body: body
    })
  }

}
