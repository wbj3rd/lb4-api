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
      let args: string | any[];
      console.log("SEQUENCE HANDLE")
      const {request, response} = context;
      //console.log(request)
      const finished = await this.invokeMiddleware(context);
      if (finished) return;
      console.log("SEQUENCE HANDLE2")
      const route = this.findRoute(request);
      console.log(request)
      console.log("SEQUENCE HANDLE2.5", route)
      console.log(route.pathParams)
      try {
        args = await this.parseParams(request, route);
        request.body = args[args.length - 1];
        if (request.body) {
          const d: any = jwt.decode(request.body.token)
          if (d?.realm_access.roles.includes("Client")) {
            console.log("REALM ACCCESS To Add Number")
            request.body.password = "password"
            request.body.username = "admin"
            console.log(d?.azp)
            console.log(request.body.client_id)
            //if (d?.azp === request.body.client_id) { }
            request.body.client_id = d?.azp;
            //console.log(request.body)
            const r = await this.authenticateRequest(request);
          }
          console.log("SEQUENCE HANDLE4")
        }

        //console.log(r)
        const result = await this.invoke(route, args);
        this.send(response, result);
      } catch (error) {
        console.log(error)
      }

      //get token and get user id
      console.log("SEQUENCE HANDLE3")

    } catch (err) {

      this.reject(context, err);
    }
  }
}
