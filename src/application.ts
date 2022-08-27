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
import multer from 'multer';
import path from 'path';
import {ResourceOwnerVerifyProvider} from './providers/auth/resource-owner-verify.provider';

import {MySequence} from './sequence';
import {FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY} from "./types/keys";
export {ApplicationConfig};

export class App<ApiApplication, FileUploadApplication> extends BootMixin(
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
    this.configureFileUpload(options.fileStorageDirectory);
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

    this.bind(Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER).toProvider(
      ResourceOwnerVerifyProvider,
    );
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

  /**
   * Configure `multer` options for file upload
   */
  protected configureFileUpload(destination?: string) {
    // Upload files to `dist/.sandbox` by default
    destination = destination ?? path.join(__dirname, '../.sandbox');
    console.log(destination)
    this.bind(STORAGE_DIRECTORY).to(destination);
    const multerOptions: multer.Options = {
      storage: multer.diskStorage({
        destination,
        // Use the original file name as is
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    };
    // Configure the file upload service with multer options
    this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);
  }
}


