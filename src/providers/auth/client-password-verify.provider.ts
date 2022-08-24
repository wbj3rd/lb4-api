import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {VerifyFunction} from 'loopback4-authentication';
import {AuthClient} from '../../models/auth-clients.model';
import {AuthClientRepository} from '../../repositories';


export class ClientPasswordVerifyProvider
  implements Provider<VerifyFunction.OauthClientPasswordFn>
{
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
  ) { }

  value(): VerifyFunction.OauthClientPasswordFn {
    console.log("VERIFY CLIENT PAAWORD")
    return async (clientId, clientSecret, req) => {
      console.log(clientId, clientSecret)
      var d = new AuthClient();
      return d
    };
  }
}
