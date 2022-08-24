import {Provider} from '@loopback/context';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, Request, RestBindings} from '@loopback/rest';
import {decode} from 'jsonwebtoken';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';
//import * as keycloak from "keycloak-backend";
import {AuthClient} from '../../models/auth-clients.model';
import {AuthUser} from '../../models/auth-user.model';
import {AuthClientRepository, UserRepository} from '../../repositories';

export class ResourceOwnerVerifyProvider
  implements Provider<VerifyFunction.ResourceOwnerPasswordFn>
{
  constructor(
    @inject(RestBindings.Http.REQUEST) private request: Request,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
  ) { }

  value(): VerifyFunction.ResourceOwnerPasswordFn {
    console.log(this.request)

    return async (clientId, clientSecret, username, password) => {
      console.log("ASYNC")
      console.log(clientId)
      console.log(clientSecret)
      const user = new AuthUser({});
      const client = new AuthClient();
      const keycloak = require("keycloak-backend")({
        "realm": "Call Center",
        "auth-server-url": "http://localhost:8081",
        "client_id": "Test Server",
        "client_secret": "o5kTjP8J2AeHZvMwEOJj3S9gzro7Eopi", // if required
        "username": "Test",
        "password": "password",
        "grant_type": "password"

      });
      console.log("KEYCLOACKSs")
      //console.log(keycloak)
      //const someAccessToken = await keycloak.accessToken.get()

      // how to get openid info from access token...
      console.log("SOME TOKEN")
      //keycloak.config
      const someAccessToken = await keycloak.accessToken.get();
      //console.log(someAccessToken)
      // info.sub contains the user id

      let token = await keycloak.jwt.verify(someAccessToken);
      //onsole.log(token.content)
      const json = decode(token, {json: true});
      //console.log(json)
      const info = await keycloak.accessToken.info(someAccessToken)
      //console.log(info)
      user.id = info.sub;
      user.username = info.preferred_username
      user.roles = token.content.realm_access.roles
      client.clientId = clientId;
      client.clientSecret = clientSecret;



      // const user = await this.userRepository.verifyPassword(username, password);
      // console.log(user)
      // if (!user) {
      //   throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      // }
      // console.log("THERE")
      // const client = await this.authClientRepository.findOne({
      //   where: {
      //     clientId,
      //   },
      // });
      // if (!client || client.userIds.indexOf(user.id || 0) < 0) {
      //   throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
      // } else if (!client.clientSecret || client.clientSecret !== clientSecret) {
      //   throw new HttpErrors.Unauthorized(
      //     AuthErrorKeys.ClientVerificationFailed,
      //   );
      // }
      if (!user) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      return {
        client,
        user,
      };
    };
  }
}
