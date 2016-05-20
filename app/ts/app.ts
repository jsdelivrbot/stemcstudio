//
// At runtime, angular is found using the System loader.
// At designtime, angular is specified in tsconfig.json.
//
import * as angular from 'angular';

//
// The following imports are to be found in the jspm.config.js file.
// The module name that we require may be different.
//

// 
// Module that provides the 'ngMdIcons' module.
//
import 'angular-material-icons';

//
// UI Bootstrap.
//
import 'angular-animate';

//
// Module that provides the 'ui.bootstrap' module.
//
import 'angular-bootstrap';

//
// Module that provides the 'ngSanitize' module.
//
import 'angular-sanitize';

//
// Module that provides the 'ui.router' module.
//
import 'angular-ui-router';

//
// Module that provides the 'ui.select' module.
//
import 'ui-select';

//
// Interfaces required for designtime TypeScript compilation.
//
import CredentialsService from './services/credentials/CredentialsService';
import AppScope from './scopes/AppScope';
import CookieService from './services/cookie/CookieService';
import githubSignInButton from './directives/githubSignIn/githubSignInButton';
import googleSignInButton from './directives/googleSignIn/googleSignInButton';
import IUuidService from './services/uuid/IUuidService';
import ITranslateProvider from './modules/translate/ITranslateProvider';
import BodyController from './controllers/BodyController';
import AboutController from './controllers/AboutController';
import LoginController from './controllers/LoginController';
import SearchController from './controllers/search/SearchController';

import FacebookLoginController from './controllers/login/facebook/FacebookLoginController';
import GitHubLoginController from './controllers/login/github/GitHubLoginController';
import TwitterLoginController from './controllers/login/twitter/TwitterLoginController';

import LabelDialogService from './modules/publish/LabelDialogService';
import LabelModalController from './modules/publish/LabelModalController';

import PublishDialogService from './modules/publish/PublishDialogService';
import brand from './directives/brand/brand';
import domain from './directives/domain/domain';
import logoText from './directives/logoText/logoText';
import pageTitle from './directives/pageTitle/pageTitle';

import propsFilter from './filters/propsFilter';

//
// Create 'app' module and declare its Angular module dependencies.
//
const app: angular.IModule = angular.module('app', [
    'ngMdIcons',
    'ngSanitize',
    'ui.bootstrap',
    'ui.bootstrap.modal',
    'ui.router',
    'ui.select'
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
    return VENDOR_FOLDER_MARKER + '/' + packageFolder + '/' + fileName;
}

// The application version for use by scopes.
app.constant('version', '2.0.1');

// Feature flags (boolean)
app.constant('FEATURE_AWS_ENABLED', false);
app.constant('FEATURE_DASHBOARD_ENABLED', false);
app.constant('FEATURE_EXAMPLES_ENABLED', true);
app.constant('FEATURE_LOGIN_ENABLED', true);
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
// Remark: This value is duplicated in views/github_callback.jade
app.constant('githubKey', makeKey('github'));

// com.stemcstudio.doodles is the local storage key for doodles.
app.constant('doodlesKey', makeKey('doodles'));

// com.stemcstudio.config is the local storage key for configuration.
app.constant('configKey', makeKey('config'));

// The following 3 files have special significance.
app.constant('FILENAME_META', 'package.json');
app.constant('FILENAME_HTML', 'index.html');
app.constant('FILENAME_README', 'README.md');

// The following 3 files have diminishing significance.
app.constant('FILENAME_CODE', 'script.ts');
app.constant('FILENAME_LIBS', 'extras.ts');
app.constant('FILENAME_LESS', 'style.less');

// Special marker to indicate that JavaScript or TypeScript file is
// stored locally in the DOMAIN/vendor folder.
// This enables us to handle locally stored files in both development and production.
// This constant is used in the `options` service to construct file locations
// and the DoodleController to look up files.
// Ultimately we would like to be able to access modules through only a manifest.
app.constant('VENDOR_FOLDER_MARKER', VENDOR_FOLDER_MARKER);

// For backwards compatibility, don't change the values of these constants.
app.constant('SCRIPTS_MARKER', '<!-- SCRIPTS-MARKER -->');
app.constant('STYLES_MARKER', '<!-- STYLES-MARKER -->');
app.constant('STYLE_MARKER', '/* STYLE-MARKER */');
app.constant('CODE_MARKER', '// CODE-MARKER');
app.constant('LIBS_MARKER', '// LIBS-MARKER');

// We can change the global namespace used by Google's Universal Analytics.
// All access should be through the service wrapper.
// We won't be fancy here, leave it as 'ga' as in views/layout.jade
app.constant('NAMESPACE_GOOGLE_ANALYTICS', 'ga');
app.constant('UNIVERSAL_ANALYTICS_TRACKING_ID', 'UA-41504069-5');

// This twitter widget namespace is a symbolic constant. It cannot be changed.
// app.constant('NAMESPACE_TWITTER_WIDGETS', 'twttr');

// The token that we receive for OAuth.
app.constant('GITHUB_TOKEN_COOKIE_NAME', 'github-token');

// Cache the user.login once we have received the token in this cookie.
app.constant('GITHUB_LOGIN_COOKIE_NAME', 'github-login');

// Names of routing states.
// WARNING: Changing state names can break ui-sref directives.
app.constant('STATE_DASHBOARD', 'dashboard');
app.constant('STATE_DOODLE', 'doodle');
app.constant('STATE_EXAMPLES', 'examples');
app.constant('STATE_GIST', 'gist');
app.constant('STATE_REPO', 'repo');

// The TypeScript d.ts library provides the type checking of global JavaScript types.
app.constant('FILENAME_TYPESCRIPT_CURRENT_LIB_DTS', vendorPath('typescript@1.4.1.3', 'lib.d.ts'));

// The MathScript js library provides operator overloading at runtime.
app.constant('FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS', vendorPath('davinci-mathscript@1.0.8', 'dist/davinci-mathscript.min.js'));

/**
 * The BodyController exists for the lifetime of the application.
 * It is referenced from layout.jade Jade template.
 */
app.controller('body-controller', BodyController);

/**
 * Page controllers.
 */
const ABOUT_CONTROLLER_NAME = 'AboutController';
app.controller(ABOUT_CONTROLLER_NAME, AboutController);
const LOGIN_CONTROLLER_NAME = 'LoginController';
app.controller(LOGIN_CONTROLLER_NAME, LoginController);
const SEARCH_CONTROLLER_NAME = 'SearchController';
app.controller(SEARCH_CONTROLLER_NAME, SearchController);

/**
 * The following controllers will be referenced from a template.
 */
app.controller('facebook-login-controller', FacebookLoginController);
app.controller('github-login-controller', GitHubLoginController);
app.controller('twitter-login-controller', TwitterLoginController);

app.directive('brand', brand);
app.directive('domain', domain);
app.directive('logoText', logoText);
app.directive('pageTitle', pageTitle);

app.directive('githubSignInButton', githubSignInButton);
app.directive('googleSignInButton', googleSignInButton);

app.filter('propsFilter', propsFilter);

app.service('credentials', CredentialsService);

app.service('labelDialog', LabelDialogService);
app.controller('LabelModalController', LabelModalController);

app.service('publishDialog', PublishDialogService);

//
// Register work which needs to be performed on module loading.
//
app.config([
    '$stateProvider',
    '$translateProvider',
    '$urlRouterProvider',
    'FEATURE_DASHBOARD_ENABLED',
    'FEATURE_EXAMPLES_ENABLED',
    'FEATURE_GIST_ENABLED',
    'FEATURE_GOOGLE_SIGNIN_ENABLED',
    'FEATURE_REPO_ENABLED',
    'STATE_DASHBOARD',
    'STATE_DOODLE',
    'STATE_EXAMPLES',
    'STATE_GIST',
    'STATE_REPO',
    function(
        $stateProvider: angular.ui.IStateProvider,
        $translateProvider: ITranslateProvider,
        $urlRouterProvider: angular.ui.IUrlRouterProvider,
        FEATURE_DASHBOARD_ENABLED: boolean,
        FEATURE_EXAMPLES_ENABLED: boolean,
        FEATURE_GIST_ENABLED: boolean,
        FEATURE_GOOGLE_SIGNIN_ENABLED: boolean,
        FEATURE_REPO_ENABLED: boolean,
        STATE_DASHBOARD: string,
        STATE_DOODLE: string,
        STATE_EXAMPLES: string,
        STATE_GIST: string,
        STATE_REPO: string
    ) {
        // FIXME: Some of the states should be replaced by modal dialogs.
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home.html',
                controller: 'home-controller'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'login.html',
                controller: LOGIN_CONTROLLER_NAME
            })
            .state('search', {
                url: '/search',
                templateUrl: 'search.html',
                controller: SEARCH_CONTROLLER_NAME
            })
            .state(STATE_DOODLE, {
                url: '/doodle',
                templateUrl: 'doodle.html',
                controller: 'DoodleController'
            })
            .state('new', {
                url: '/new',
                templateUrl: 'new.html',
                controller: 'new-controller'
            })
            .state('open', {
                url: '/open',
                templateUrl: 'open.html',
                controller: 'open-controller'
            })
            .state('copy', {
                url: '/copy',
                templateUrl: 'copy.html',
                controller: 'copy-controller'
            })
            .state('properties', {
                url: '/properties',
                templateUrl: 'properties.html',
                controller: 'properties-controller'
            })
            .state('download', {
                url: '/download',
                templateUrl: 'download.html',
                controller: 'download-controller'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'about.html',
                controller: ABOUT_CONTROLLER_NAME
            });

        if (FEATURE_DASHBOARD_ENABLED) {
            $stateProvider.state(STATE_DASHBOARD, {
                url: '/dashboard',
                templateUrl: 'dashboard.html',
                controller: 'DashboardController'
            });
        }
        else {
            // TODO: Recognize the url but go to a no droids here.
        }

        if (FEATURE_EXAMPLES_ENABLED) {
            $stateProvider.state(STATE_EXAMPLES, {
                url: '/examples',
                templateUrl: 'examples.html',
                controller: 'examples-controller'
            });
        }
        else {
            // TODO: Recognize the url but go to a no droids here.
        }

        if (FEATURE_GIST_ENABLED) {
            $stateProvider.state(STATE_GIST, {
                url: '/gists/{gistId}',
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
        else {
            // TODO: Recognize the url but go to a no droids here.
        }

        $urlRouterProvider.otherwise('/');

        $translateProvider
            .translations('en', {
                APP_NAME: 'STEMCstudio',
                BUTTON_TEXT_EN: 'english',
                BUTTON_TEXT_DE: 'german'
            })
            .translations('de', {
                APP_NAME: 'STEMCstudio',
                BUTTON_TEXT_EN: 'englisch',
                BUTTON_TEXT_DE: 'deutsch'
            });

        $translateProvider.preferredLanguage = 'en';
        $translateProvider.useLocalStorage();

    }]);


//
// Register work which should be performed when the injector is done loading all modules.
//
app.run([
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    'credentials',
    'cookie',
    'uuid4',
    'ga',
    'githubKey',
    'version',
    'FEATURE_GIST_ENABLED',
    'FEATURE_GOOGLE_SIGNIN_ENABLED',
    'FEATURE_LOGIN_ENABLED',
    'FEATURE_REPO_ENABLED',
    'GITHUB_LOGIN_COOKIE_NAME',
    'GITHUB_TOKEN_COOKIE_NAME',
    'UNIVERSAL_ANALYTICS_TRACKING_ID',
    function(
        $rootScope: AppScope,
        $state: angular.ui.IStateService,
        $stateParams: angular.ui.IStateParamsService,
        $window: Window,
        credentials: CredentialsService,
        cookie: CookieService,
        uuid4: IUuidService,
        ga: UniversalAnalytics.ga,
        githubKey: string,
        version: string,
        FEATURE_GIST_ENABLED: boolean,
        FEATURE_GOOGLE_SIGNIN_ENABLED: boolean,
        FEATURE_LOGIN_ENABLED: boolean,
        FEATURE_REPO_ENABLED: boolean,
        GITHUB_LOGIN_COOKIE_NAME: string,
        GITHUB_TOKEN_COOKIE_NAME: string,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string
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
        $rootScope.FEATURE_LOGIN_ENABLED = FEATURE_LOGIN_ENABLED;

        // The server drops this cookie so that we can make the GitHub autorization request.
        $rootScope.clientId = function() {
            if (FEATURE_LOGIN_ENABLED) {
                return cookie.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME);
            }
            else {
                return void 0;
            }
        };

        $rootScope.isGitHubSignedIn = function() {
            if (FEATURE_LOGIN_ENABLED) {
                return cookie.hasItem(GITHUB_TOKEN_COOKIE_NAME);
            }
            else {
                console.warn(`FEATURE_LOGIN_ENABLED => ${FEATURE_LOGIN_ENABLED}`);
                return false;
            }
        };

        $rootScope.userLogin = function() {
            if (FEATURE_LOGIN_ENABLED) {
                return cookie.getItem(GITHUB_LOGIN_COOKIE_NAME);
            }
            else {
                console.warn(`FEATURE_LOGIN_ENABLED => ${FEATURE_LOGIN_ENABLED}`);
                return void 0;
            }
        };

        if (FEATURE_GOOGLE_SIGNIN_ENABLED) {
            $rootScope.isGoogleSignedIn = function() {
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

export default app;
