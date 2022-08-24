import {inject} from '@loopback/core';
import {FindRoute, InvokeMethod, InvokeMiddleware, ParseParams, Reject, RequestContext, Send, SequenceActions, SequenceHandler} from '@loopback/rest';
import * as jwt from 'jsonwebtoken';
import {AuthenticationBindings} from 'loopback4-authentication';
import {AuthUser} from './models/auth-user.model';
import {AuthenticateFn} from './types/keycloak.types';


export class MySequence implements SequenceHandler {
  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false;
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<AuthUser>,

  ) { }

  async handle(context: RequestContext) {
    try {
      console.log("SEQUENCE HANDLE")
      const {request, response} = context;
      console.log(request)
      const finished = await this.invokeMiddleware(context);
      if (finished) return;
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];
      //get token and get user id
      const d: any = jwt.decode(request.body.token)
      // how to distinguish between call from browser vs call from endpoint

      if (d.realm_access.roles.includes("Client")) {
        console.log("REALM ACCCESS To Add Number")
        request.body.password = "password"
        request.body.username = "admin"
        console.log(d?.azp)
        console.log(request.body.client_id)
        //if (d?.azp === request.body.client_id) { }
        request.body.client_id = d?.azp;
        //console.log(request.body)
      }
      //request.body.client_id = d?.azp;
      //equest.body.username = "admin"r

      //console.log(await this.authenticateRequest(request))
      const r = await this.authenticateRequest(request);
      //console.log(r)
      //let rcpas = new ResourceOwnerVerifyProvider();
      //console.log(await rcpas.value())
      //context.bind('MY_USER_ID').to("SDSADASDSAD")
      console.log("HOLD UP")
      //console.log(r)
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {

      this.reject(context, err);
    }
  }

  async test() {
    return "TEST"
  }
}
