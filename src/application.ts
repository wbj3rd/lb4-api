import {AuthorizationComponent, AuthorizationDecision, AuthorizationOptions} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
//import {ResourceOwnerVerifyProvider} from 'loopback4-authentication/dist/strategies';

import path from 'path';
import {ResourceOwnerVerifyProvider} from './providers/auth/resource-owner-verify.provider';

import {MySequence} from './sequence';

export {ApplicationConfig};

export class ApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));
    // Add authentication component
    this.component(AuthenticationComponent);
    // ---------- MAKE SURE THE FOLLOWING PARTS ARE CORRECT
    // bind set authorization options
    const authoptions: AuthorizationOptions = {
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY,
    };

    // mount authorization component
    const binding = this.component(AuthorizationComponent);
    // configure authorization component
    this.configure(binding.key).to(authoptions);

    // bind the authorizer provider
    // this
    //   .bind('authorizationProviders.my-authorizer-provider')
    //   .toProvider(MyAuthorizationProvider)
    //   .tag(AuthorizationTags.AUTHORIZER);

    // ------------- END OF SNIPPET -------------

    // Customize authentication verify handlers
    //this.bind(Strategies.Passport.KEYCLOAK_VERIFIER).toProvider(
    //  KeycloakVerifyProvider,
    //);
    // Customize authentication verify handlers
    this.bind(Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER).toProvider(
      ResourceOwnerVerifyProvider,
    );

    //this.bind(Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER).toProvider(
    //  ClientPasswordVerifyProvider,
    //);
    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
