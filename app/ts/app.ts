//
// This file configures the AngularJS module.
//
import { downgradeComponent } from '@angular/upgrade/static';
import { downgradeInjectable } from '@angular/upgrade/static';

import { APP_VERSION } from './constants';
import { EMBEDDING_PARAM_EMBED } from './constants';
import { EMBEDDING_PARAM_FILE } from './constants';
import { EMBEDDING_PARAM_HIDE_CODE } from './constants';
import { EMBEDDING_PARAM_HIDE_EXPLORER } from './constants';
import { EMBEDDING_PARAM_HIDE_README } from './constants';
import { GITHUB_TOKEN_COOKIE_NAME } from './constants';

//
// The following imports are to be found in the jspm.config.js file.
// The module name that we require may be different.
// Be careful when modifying these imports; some work because of side-effects,
// some imports (interface definitions) don't have the side effect of module loading.
//

//
// Module that provides AngularJS (1.x)
//
import { module } from 'angular';
import { IDirectiveFactory } from 'angular';
import { ILocationProvider } from 'angular';

//
// AngularJS module for animation.
// This may not be being used.
//
import 'angular-animate';
// 
// Module that provides the 'ngMdIcons' module.
//
import 'angular-material-icons';
//
// AngularJS module that provides the 'ngSanitize' module.
//
import 'angular-sanitize';
//
// AngularJS module for translation.
// This may not be being used.
//
import 'angular-translate';
//
// AngularJS module that provides the 'ui.bootstrap' module.
//
import 'angular-ui-bootstrap';
//
// AngularJS module that provides the 'ui.router' module.
//
import 'angular-ui-router';
//
//
//
import { IStateParamsService, IStateService, IStateProvider, IUrlRouterProvider } from 'angular-ui-router';

//
// Module that provides the 'ui.select' module.
//
import 'ui-select';

import { TYPESCRIPT_SERVICES_VERSION } from './constants';

//
// Interfaces required for designtime TypeScript compilation.
//
import { CREDENTIALS_SERVICE_UUID, ICredentialsService } from './services/credentials/ICredentialsService';
import { CredentialsService } from './services/credentials/credentials.service';
import { AppScope } from './scopes/AppScope';
import { COOKIE_SERVICE_UUID, ICookieService } from './services/cookie/ICookieService';
import { RoomsService } from './modules/rooms/services/rooms.service';
import { ROOMS_SERVICE_UUID } from './modules/rooms/api';

import { githubSignInButton } from './directives/githubSignIn/githubSignInButton';
import { googleSignInButton } from './directives/googleSignIn/googleSignInButton';
import { BodyController } from './controllers/BodyController';
import { HomeController } from './controllers/HomeController';
import { RoomsController } from './modules/rooms/controllers/rooms.controller';

import { FacebookLoginController } from './controllers/login/facebook/FacebookLoginController';
import { GitHubLoginController } from './controllers/login/github/GitHubLoginController';
import { TwitterLoginController } from './controllers/login/twitter/TwitterLoginController';

import { LabelDialogService } from './modules/labelsAndTags/LabelDialogService';
import { NewProjectService } from './modules/project/NewProjectService';
import { OpenProjectService } from './modules/project/OpenProjectService';
import { CopyProjectService } from './modules/project/CopyProjectService';
import { PropertiesDialogService } from './modules/properties/PropertiesDialogService';

import { BrandComponent } from './directives/brand/brand.component';
import { logoText } from './directives/logoText/logoText';
import { packageName } from './directives/packageName/packageName';
import { pageTitle } from './directives/pageTitle/pageTitle';

import { propsFilter } from './filters/propsFilter';

// Local (AngularJS) modules.
// Import them and then use their name as app module dependencies.
import { editorStorageModule } from './modules/preferences/index';
import { tslintModule } from './modules/tslint/index';
import { stemcArXivModule } from './modules/stemcArXiv/index';
import { editorDialogModule } from './modules/editors/index';

//
//
//
import { BackgroundService } from './services/background/background.service';
import { BACKGROUND_SERVICE_UUID } from './services/background/IBackgroundService';

//
//
//
import { DoodleManager } from './services/doodles/doodleManager.service';
import { DOODLE_MANAGER_SERVICE_UUID } from './services/doodles/IDoodleManager';

//
//
//
import { GitHubAuthManager } from './services/gham/GitHubAuthManager';
import { GITHUB_AUTH_MANAGER_UUID } from './services/gham/IGitHubAuthManager';

//
//
//
import { NavigationServiceJS } from './modules/navigation/NavigationServiceJS';
import { NAVIGATION_SERVICE_UUID } from './modules/navigation/INavigationService';

//
//
//
// import { MONACO_EDITOR_SERVICE_UUID, MonacoEditorService } from './services/editor/monaco-editor.service';
import { NATIVE_EDITOR_SERVICE_UUID, NativeEditorService } from './services/editor/native-editor.service';

//
//
//
import { OptionManager } from './services/options/optionManager.service';
import { OPTION_MANAGER_SERVICE_UUID } from './services/options/IOptionManager';

//
//
//
import { UuidService } from './services/uuid/uuid.service';
import { UUID_SERVICE_UUID } from './services/uuid/IUuidService';

//
//
//
import { JsModel } from './modules/jsmodel/JsModel';
import { JAVASCRIPT_MODEL_UUID } from './modules/jsmodel/IJavaScriptModel';

//
//
//
import { WsModel } from './modules/wsmodel/WsModel';
import { WORKSPACE_MODEL_UUID } from './modules/wsmodel/IWorkspaceModel';

//
//
//
import { STATE_DASHBOARD } from './modules/navigation/NavigationServiceJS';
import { STATE_WORKSPACE } from './modules/navigation/NavigationServiceJS';
import { STATE_DOWNLOAD } from './modules/navigation/NavigationServiceJS';
import { STATE_EXAMPLES } from './modules/navigation/NavigationServiceJS';
import { STATE_GIST } from './modules/navigation/NavigationServiceJS';
import { STATE_HOME } from './modules/navigation/NavigationServiceJS';
import { STATE_REPO } from './modules/navigation/NavigationServiceJS';
import { STATE_ROOM } from './modules/navigation/NavigationServiceJS';

//
// Create 'app' module and declare its Angular module dependencies.
//
export const app = module('app', [
    'ngMdIcons',
    'ngSanitize',
    'ui.bootstrap',
    'ui.bootstrap.modal',
    'ui.router',
    'ui.select',
    editorStorageModule.name,
    stemcArXivModule.name,
    tslintModule.name,
    editorDialogModule.name
]);

/**
 * makeKey('name') => 'com.stemcstudio.name'
 */
function makeKey(name: string): string {
    const DOMAIN = ['stemcstudio', 'com'];
    return DOMAIN.reverse().concat(name).join('.');
}

/**
 * Allows us to run from the 'generated' or 'dist' folder depending on the NODE_ENV.
 */
const VENDOR_FOLDER_MARKER = '$VENDOR-FOLDER-MARKER';

function vendorPath(packageFolder: string, fileName: string): string {
    return `${VENDOR_FOLDER_MARKER}/${packageFolder}/${fileName}`;
}

// The application version.
// This is put on the AppScope.
app.constant('version', APP_VERSION);

// Feature flags (boolean)
app.constant('FEATURE_AWS_ENABLED', false);
app.constant('FEATURE_DASHBOARD_ENABLED', false);
app.constant('FEATURE_EXAMPLES_ENABLED', true);
// Disable the context menu on the editor until the keyboard implementation has been worked out.
app.constant('FEATURE_EDITOR_CONTEXT_MENU', false);
app.constant('FEATURE_GIST_ENABLED', true);
app.constant('FEATURE_I18N_ENABLED', true);
app.constant('FEATURE_REPO_ENABLED', false);
// Features for authentication.
app.constant('FEATURE_AMAZON_SIGNIN_ENABLED', false);
app.constant('FEATURE_GITHUB_SIGNIN_ENABLED', true);
app.constant('FEATURE_GOOGLE_SIGNIN_ENABLED', true);
app.constant('FEATURE_TWITTER_SIGNIN_ENABLED', false);
app.constant('FEATURE_FACEBOOK_SIGNIN_ENABLED', false);

// githubKey stores the key of the item in local storage for maintaining GitHub OAuth data.
// Remark: This value is duplicated in views/github_callback.pug
app.constant('githubKey', makeKey('github'));

// com.stemcstudio.config is the local storage key for configuration.
app.constant('configKey', makeKey('config'));

// The following 3 files have special significance.
app.constant('FILENAME_META', 'package.json');
app.constant('FILENAME_HTML', 'index.html');
app.constant('FILENAME_README', 'README.md');

// Special marker to indicate that JavaScript or TypeScript file is
// stored locally in the DOMAIN/vendor folder.
// This enables us to handle locally stored files in both development and production.
// This constant is used in the `options` service to construct file locations
// and the DoodleController to look up files.
// Ultimately we would like to be able to access modules through only a manifest.
app.constant('VENDOR_FOLDER_MARKER', VENDOR_FOLDER_MARKER);

// This twitter widget namespace is a symbolic constant. It cannot be changed.
// app.constant('NAMESPACE_TWITTER_WIDGETS', 'twttr');

// Cache the user.login once we have received the token in this cookie.
app.constant('GITHUB_LOGIN_COOKIE_NAME', 'github-login');

// The TypeScript d.ts library provides the type checking of global JavaScript types.
// WARNING: The Gruntfile.js must also copy the same version.
app.constant('FILENAME_TYPESCRIPT_CURRENT_LIB_DTS', vendorPath(`typescript@${TYPESCRIPT_SERVICES_VERSION}`, 'lib.d.ts'));
app.constant('FILENAME_TYPESCRIPT_ES2015_CORE_DTS', vendorPath(`typescript@${TYPESCRIPT_SERVICES_VERSION}`, 'lib.es2015.core.d.ts'));
app.constant('FILENAME_TYPESCRIPT_PROMISE_LIB_DTS', vendorPath(`typescript@${TYPESCRIPT_SERVICES_VERSION}`, 'lib.es2015.promise.d.ts'));

// The MathScript js library provides operator overloading at runtime.
// The version should match the value in the Gruntfile.js
app.constant('FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS', vendorPath('davinci-mathscript@1.3.1', 'dist/davinci-mathscript.min.js'));

/**
 * The BodyController exists for the lifetime of the application.
 * It is referenced from layout.jade Jade template.
 */
app.controller('body-controller', BodyController);

/**
 * Page controllers.
 */
const HOME_CONTROLLER_NAME = 'HomeController';
app.controller(HOME_CONTROLLER_NAME, HomeController);

/**
 * 
 */
app.controller('rooms-controller', RoomsController);

/**
 * The following controllers will be referenced from a template.
 */
app.controller('facebook-login-controller', FacebookLoginController);
app.controller('github-login-controller', GitHubLoginController);
app.controller('twitter-login-controller', TwitterLoginController);

app.directive('brand', downgradeComponent({ component: BrandComponent }) as IDirectiveFactory);
app.directive('logoText', logoText);
app.directive('pageTitle', pageTitle);
app.directive('packageName', packageName);

app.directive('githubSignInButton', githubSignInButton);
app.directive('googleSignInButton', googleSignInButton);

app.filter('propsFilter', propsFilter);

app.service('labelDialog', LabelDialogService);
app.service('newProject', NewProjectService);
app.service('openProject', OpenProjectService);
app.service('copyProject', CopyProjectService);
app.service('propertiesDialog', PropertiesDialogService);

app.service(BACKGROUND_SERVICE_UUID, BackgroundService);
app.factory(CREDENTIALS_SERVICE_UUID, downgradeInjectable(CredentialsService));
app.factory(DOODLE_MANAGER_SERVICE_UUID, downgradeInjectable(DoodleManager));
app.service(GITHUB_AUTH_MANAGER_UUID, GitHubAuthManager);
app.factory(JAVASCRIPT_MODEL_UUID, downgradeInjectable(JsModel));
app.service(NAVIGATION_SERVICE_UUID, NavigationServiceJS);
// app.factory(MONACO_EDITOR_SERVICE_UUID, downgradeInjectable(MonacoEditorService));
app.factory(NATIVE_EDITOR_SERVICE_UUID, downgradeInjectable(NativeEditorService));
app.factory(OPTION_MANAGER_SERVICE_UUID, downgradeInjectable(OptionManager));
app.factory(ROOMS_SERVICE_UUID, downgradeInjectable(RoomsService));
app.factory(UUID_SERVICE_UUID, downgradeInjectable(UuidService));
app.factory(WORKSPACE_MODEL_UUID, downgradeInjectable(WsModel));

//
// Register work which needs to be performed on module loading.
//
app.config([
    '$locationProvider',
    '$stateProvider',
    '$urlRouterProvider',
    'FEATURE_DASHBOARD_ENABLED',
    'FEATURE_EXAMPLES_ENABLED',
    'FEATURE_GIST_ENABLED',
    'FEATURE_REPO_ENABLED',
    function (
        $locationProvider: ILocationProvider,
        $stateProvider: IStateProvider,
        $urlRouterProvider: IUrlRouterProvider,
        FEATURE_DASHBOARD_ENABLED: boolean,
        FEATURE_EXAMPLES_ENABLED: boolean,
        FEATURE_GIST_ENABLED: boolean,
        FEATURE_REPO_ENABLED: boolean
    ) {
        const embeddingParams = [
            EMBEDDING_PARAM_EMBED,
            EMBEDDING_PARAM_FILE,
            EMBEDDING_PARAM_HIDE_CODE,
            EMBEDDING_PARAM_HIDE_EXPLORER,
            EMBEDDING_PARAM_HIDE_README
        ];
        const optionalEmbeddingParams = `?${embeddingParams.join('&')}`;
        $stateProvider
            .state(STATE_HOME, {
                url: '/',
                templateUrl: 'home.html',
                controller: HOME_CONTROLLER_NAME
            })
            .state(STATE_WORKSPACE, {
                url: `/workspace${optionalEmbeddingParams}`,
                templateUrl: 'doodle.html',
                controller: 'DoodleController'
            })
            // TODO: This should be replaced by a modal dialog.
            .state(STATE_DOWNLOAD, {
                url: '/download',
                templateUrl: 'download.html',
                controller: 'download-controller'
            });

        if (FEATURE_DASHBOARD_ENABLED) {
            $stateProvider.state(STATE_DASHBOARD, {
                url: '/dashboard',
                templateUrl: 'dashboard.html',
                controller: 'DashboardController'
            });
        }

        if (FEATURE_EXAMPLES_ENABLED) {
            $stateProvider.state(STATE_EXAMPLES, {
                url: '/examples',
                templateUrl: 'examples.html',
                controller: 'examples-controller'
            });
        }

        if (FEATURE_GIST_ENABLED) {
            $stateProvider.state(STATE_GIST, {
                url: `/gists/{gistId}${optionalEmbeddingParams}`,
                templateUrl: 'doodle.html',
                controller: 'DoodleController'
            });
        }
        else {
            // TODO: Recognize the url but go to a no droids here.
        }

        if (FEATURE_REPO_ENABLED) {
            $stateProvider.state(STATE_REPO, {
                url: '/users/{owner}/repos/{repo}',
                templateUrl: 'doodle.html',
                controller: 'DoodleController'
            });
        }

        $stateProvider.state(STATE_ROOM, {
            url: '/rooms/{roomId}',
            templateUrl: 'doodle.html',
            controller: 'DoodleController'
        });

        $urlRouterProvider.otherwise('/');

        $locationProvider.hashPrefix("");
        $locationProvider.html5Mode(true);
    }]);


//
// Register work which should be performed when the injector is done loading all modules.
//
app.run([
    '$rootScope',
    '$state',
    '$stateParams',
    CREDENTIALS_SERVICE_UUID,
    COOKIE_SERVICE_UUID,
    'version',
    'FEATURE_GOOGLE_SIGNIN_ENABLED',
    'GITHUB_LOGIN_COOKIE_NAME',
    function (
        $rootScope: AppScope,
        $state: IStateService,
        $stateParams: IStateParamsService,
        credentials: ICredentialsService,
        cookieService: ICookieService,
        version: string,
        FEATURE_GOOGLE_SIGNIN_ENABLED: boolean,
        GITHUB_LOGIN_COOKIE_NAME: string
    ) {
        // The name of this cookie must correspond with the cookie sent back from the server.
        const GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME = 'stemcstudio-github-application-client-id';

        // Establish the unauthorized credential.
        credentials.initialize();

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope (HTML template) within the application.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.version = version;

        $rootScope.brandPartA = 'STEM';
        $rootScope.brandPartB = 'C';
        $rootScope.brandPartC = 'studio';
        $rootScope.brandPartD = 'com';

        // The server drops this cookie so that we can make the GitHub autorization request.
        $rootScope.clientId = function clientId(): string | null {
            return cookieService.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME);
        };

        $rootScope.isGitHubSignedIn = function isGitHubSignedIn(): boolean {
            return cookieService.hasItem(GITHUB_TOKEN_COOKIE_NAME);
        };

        $rootScope.userLogin = function userLogin(): string | null {
            return cookieService.getItem(GITHUB_LOGIN_COOKIE_NAME);
        };

        if (FEATURE_GOOGLE_SIGNIN_ENABLED) {
            $rootScope.isGoogleSignedIn = function isGoogleSignedIn(): boolean {
                if (gapi.auth2) {
                    const auth2 = gapi.auth2.getAuthInstance();
                    return auth2.isSignedIn.get();
                }
                else {
                    return false;
                }
            };
        }
    }]);
