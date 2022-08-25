import {Getter, inject} from '@loopback/core';
import {
  get, HttpErrors, post, Request, requestBody, response,
  ResponseObject, RestBindings
} from '@loopback/rest';
import jwt from 'jsonwebtoken';
import {authenticate, AuthenticationBindings, AuthErrorKeys, ClientAuthCode, STRATEGY} from 'loopback4-authentication';
import {AuthClient} from '../models/auth-clients.model';
import {AuthUser} from '../models/auth-user.model';
import {User} from '../models/user.model';

import {repository} from '@loopback/repository';
import * as crypto from 'crypto';
import {TokenResponse} from '../models/token-response.dto';
import {AuthClientRepository, UserRepository} from '../repositories';

import {TwilioDataSource} from '../datasources';
import {NodeService} from '../services';
import {AuthenticateErrorKeys} from '../types/error-keys';
/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request,
    //@inject('MY_USER_ID') public authorizedUserId: number,
    @repository(UserRepository)
    public userRepo: UserRepository,
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private readonly getCurrentUser: Getter<User>,
    @inject.getter(AuthenticationBindings.CURRENT_CLIENT)
    private readonly getCurrentClient: Getter<AuthClient>,
    @inject('services.NodeService')
    protected nodeService: NodeService,
    @inject('datasources.twilio')
    protected twilioDataSource: TwilioDataSource,

  ) { }

  // Map to `GET /ping`
  @get('/ping')
  @response(200, PING_RESPONSE)
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @get('/create/solution')
  @response(200)
  async createSolution() {
    //add phone number to db and to asterisk
    //add queue to db and to asterisk
    //add hold music to asterisk and create recording in db
    //add agents to asterisk and add agents to solution in db
    //fwconsole reload
    //overall goal =>create solution in db store queue id, hold music, agents, phone number

    return this.nodeService.getGreeting()

  }
  @get('/available/numbers')
  @response(200)
  async availableNumbers() {
    //call asterisk  and add agent to dynamic queue
    //add agent to solution
    //fwconsole reload
    console.log("Available Number")
    return await this.twilioDataSource.availableNumbers()
  }

  @get('/purchase/number')
  @response(200)
  async purchaseNumber(phoneNumber: string) {
    //call asterisk  and add agent to dynamic queue
    //add agent to solution
    //fwconsole reload
    console.log("Purchase Number")
    return await this.twilioDataSource.purchaseNumber(phoneNumber)
  }

  @get('/queue/add/agent')
  @response(200)
  async addAgent() {
    //call asterisk  and add agent to dynamic queue
    //add agent to solution
    //fwconsole reload
    console.log("Add Agebt")
    return this.nodeService.addAgentToQueue()
  }
  @get('/create/hold-music')
  @response(200)
  async createHoldMusic() {
    //call asterisk server and upload music
    //add music to db
    //fwconsole reload
    console.log("Add Music")
    return this.nodeService.addMusic()
  }
  @post('/create/agent')
  @response(200)
  async createAgent() {
    //call asterisk sdd misc ext
    //OR
    //call asterisk and add extension and user to db => if they ar eusing a softphoe
    console.log("Add Agent")
    return this.nodeService.addUser()
  }
  @post('/create/incoming-route')
  @response(200)
  async createIncoming() {
    console.log("Create Incoming")
    //call twilio and create number
    //call asterisk and add number
    //add both to database phone number => phone number db
    // store asterisk incoming id with phone number
    //stroe twilio id with number

    return this.nodeService.addIncoming()

  }
  @post('/create/queue')
  @response(200)
  async createQueue() {
    console.log("Create Incoming")
    //call twilio and create number
    //call asterisk and add number
    //add both to database phone number => phone number db
    // store asterisk incoming id with phone number
    //stroe twilio id with number

    return this.nodeService.addQueue()

  }
  @post('/agent/edit/number')
  @response(200)
  async agentChangeNumber() {
    console.log("Edit NUmber")
    //call twilio and create number
    //call asterisk and add number
    //add both to database phone number => phone number db
    // store asterisk incoming id with phone number
    //stroe twilio id with number

    return this.nodeService.agentChangeNumber()

  }
  @post('/client/edit/queue')
  @response(200)
  async clientEditQueue() {
    console.log("Edit Queue")
    //call twilio and create number
    //call asterisk and add number
    //add both to database phone number => phone number db
    // store asterisk incoming id with phone number
    //stroe twilio id with number

    return this.nodeService.clientChangeQueue()

  }
  @post('/client/edit/music')
  @response(200)
  async clientEditWQueue() {
    console.log("Edit Music")
    //call twilio and create number
    //call asterisk and add number
    //add both to database phone number => phone number db
    // store asterisk incoming id with phone number
    //stroe twilio id with number

    return this.nodeService.clientChangeMusic()

  }
  @post("/buy-number")
  @authenticate(STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT)
  async buyNumber(
    @requestBody() req: any,
  ) {
    console.log(req)
    await this.loginWithClientUser(req)
    return "BUY NUMBER"
  }

  @post('/auth/login-token')
  @response(200)
  @authenticate(STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT, {
    //successReturnToOrRedirect: '/',
    //passReqToCallback: true,
    //failureRedirect: options.loginFailPage || '/login',
    failureFlash: true
  })
  async loginWithClientUser(
    @requestBody() req: any,
  ): Promise<any> {
    console.log("LOGIN")
    //var u = this.getCurrentClient()
    //return this.authorizedUserId
    return this.getCurrentUser()
  }


  private async createJWT(
    payload: ClientAuthCode<User>,
    authClient: AuthClient,
  ): Promise<TokenResponse> {
    try {
      let user: User | undefined;
      if (payload.user) {
        user = payload.user;
      } else if (payload.userId) {
        user = await this.userRepo.findById(payload.userId);
      }
      if (!user) {
        throw new HttpErrors.Unauthorized(
          AuthenticateErrorKeys.UserDoesNotExist,
        );
      }
      // const userTenant = await this.userTenantRepo.findOne({
      //   where: {
      //     userId: user.getId(),
      //     tenantId: user.defaultTenant,
      //   },
      // });
      // if (!userTenant) {
      //   throw new HttpErrors.Unauthorized(
      //     AuthenticateErrorKeys.UserDoesNotExist,
      //   );
      // } else if (userTenant.status !== 'active') {
      //   throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserInactive);
      // }
      // Create user DTO for payload to JWT
      const authUser: AuthUser = new AuthUser(user);
      // authUser.tenant = await this.userTenantRepo.tenant(userTenant.id);
      // const role = await this.userTenantRepo.role(userTenant.id);
      // const utPerms = await this.utPermsRepo.find({
      //   where: {
      //     userTenantId: userTenant.id,
      //   },
      //   fields: {
      //     permission: true,
      //     allowed: true,
      //   },
      // });
      // authUser.permissions = this.getUserPermissions(utPerms, role.permissions);
      // authUser.role = role.roleKey.toString();
      const accessToken = jwt.sign(
        authUser.toJSON(),
        process.env.JWT_SECRET as string,
        {
          expiresIn: authClient.accessTokenExpiration,
          issuer: process.env.JWT_ISSUER,
        },
      );
      const size = 32,
        ms = 1000;
      const refreshToken: string = crypto.randomBytes(size).toString('hex');
      // Set refresh token into redis for later verification
      // await this.refreshTokenRepo.set(
      //   refreshToken,
      //   {clientId: authClient.clientId, userId: user.id},
      //   {ttl: authClient.refreshTokenExpiration * ms},
      // );
      return new TokenResponse({accessToken, refreshToken});
    } catch (error) {
      // eslint-disable-next-line no-prototype-builtins
      if (HttpErrors.HttpError.prototype.isPrototypeOf(error)) {
        throw error;
      } else {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
    }
  }
}
