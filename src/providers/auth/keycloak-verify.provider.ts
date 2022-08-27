import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  IAuthUser,
  VerifyFunction
} from 'loopback4-authentication';
import {AuthUser} from '../../models/authUser.model';

import {UserCredentialsRepository, UserRepository} from '../../repositories';


export class KeycloakVerifyProvider
  implements Provider<VerifyFunction.KeycloakAuthFn>
{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
  ) { }

  value(): VerifyFunction.KeycloakAuthFn {
    console.log("VERIFY")
    return async (accessToken, refreshToken, profile) => {
      var user: IAuthUser = {
        username: 'Walter'
      }

      const authUser: AuthUser = new AuthUser({
        ...user,
        id: user.id,
      });
      authUser.permissions = [];
      authUser.externalAuthToken = accessToken;
      authUser.externalRefreshToken = refreshToken;
      return authUser;
    };
  }
}
