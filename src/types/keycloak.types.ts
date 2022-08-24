import {BindingKey} from '@loopback/core';
import {Request, Response} from '@loopback/rest';
import {VerifyFunction} from 'loopback4-authentication';

export namespace Keycloak {
  export interface StrategyOptions {
    host: string;
    realm: string;
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    authorizationURL: string;
    tokenURL: string;
    userInfoURL: string;
  }

  export interface Profile {
    keycloakId: string;
    fullName: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    avatar: string;
    realm: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

  export type VerifyCallback = (
    err?: string | Error,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info?: any,
  ) => void;
}
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT



export interface IAuthClient {
  clientId: string;
  clientSecret: string;
  redirectUrl?: string;
}

export interface IAuthUser {
  id?: number | string;
  username: string;
  password?: string;
}

export interface AuthenticationMetadata<T = void> {
  strategy: string;
  options?: Object;
  verifier?: BindingKey<VerifyFunction.GenericAuthFn<T>>;
  authOptions?: (req: Request) => Object;
}

/**
 * interface definition of a function which accepts a request
 * and returns an authenticated user
 */
export interface AuthenticateFn<T> {
  (request: Request, response?: Response): Promise<T>;
}

export interface ClientAuthCode<T extends IAuthUser, ID = number> {
  clientId: string;
  userId?: ID;
  user?: T;
}
