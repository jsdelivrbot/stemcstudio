//
// At runtime, angular is found using the System loader.
// At designtime, angular is specified in tsconfig.json.
//
import * as angular from 'angular';

// 
// Module that provides the 'ngMdIcons' (Angular Material Icons) module.
//
import 'angular-material-icons';

//
// UI Bootstrap.
//
import 'angular-animate';

//
// Module that provides the 'ui.bootstrap' (Angular) module.
//
import 'angular-bootstrap';

//
// Module that provides the 'ui.router' (Angular) module.
//
import 'angular-ui-router';

//
// Interfaces required for designtime TypeScript compilation.
//
import AppScope from './AppScope';
import CookieService from './services/cookie/CookieService';
import IGitHubItem from './services/gham/IGitHubItem';
import IUuidService from './services/uuid/IUuidService';

import BootstrapDialog from 'bootstrap-dialog';

//
// Create 'app' module and declare its Angular module dependencies.
//
const app: angular.IModule = angular.module('app', [
    'ngMdIcons',
    'ui.bootstrap',
    'ui.bootstrap.modal',
    'ui.router'
]);

function makeKey(name: string): string {
    const DOMAIN = ['mathdoodle', 'io'];
    return DOMAIN.reverse().concat(name).join('.');
}

const VENDOR_FOLDER_MARKER = '$VENDOR-FOLDER-MARKER';

function vendorPath(packageFolder: string, fileName: string): string {
    return VENDOR_FOLDER_MARKER + '/' + packageFolder + '/' + fileName;
}

app.constant('version', '2.0.0-beta.22');
// githubKey stores the key of the item in local storage for maintaining GitHub OAuth data.
// Remark: This value is duplicated in views/github_callback.jade
app.constant('githubKey', makeKey('github'));
// io.mathdoodle.doodles is the local storage key for doodles.
app.constant('doodlesKey', makeKey('doodles'));
// io.mathdoodle.config is the local storage key for configuration.
app.constant('configKey', makeKey('config'));

// The following 3 files have special significance.
app.constant('FILENAME_META', 'doodle.json');
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
app.constant('NAMESPACE_GOOGLE_ANALYTICS', 'googleAnalytics');
// This twitter widget namespace is a symbolic constant. It cannot be changed.
app.constant('NAMESPACE_TWITTER_WIDGETS', 'twttr');
app.constant('GITHUB_TOKEN_COOKIE_NAME', 'github-token');

app.constant('STATE_DOODLE', 'doodle');
app.constant('STATE_EXAMPLES', 'examples');
app.constant('STATE_GISTS', 'gists');

// The TypeScript d.ts library provides the type checking of global JavaScript types.
app.constant('FILENAME_TYPESCRIPT_CURRENT_LIB_DTS', vendorPath('typescript@1.4.1.3', 'lib.d.ts'))
// The MathScript js library provides operator overloading at runtime.
app.constant('FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS', vendorPath('davinci-mathscript@1.0.8', 'dist/davinci-mathscript.min.js'))

//
// Register work which needs to be performed on module loading.
//
app.config([
    '$stateProvider',
    '$urlRouterProvider',
    'STATE_DOODLE',
    'STATE_EXAMPLES',
    'STATE_GISTS',
    function(
        $stateProvider: angular.ui.IStateProvider,
        $urlRouterProvider: angular.ui.IUrlRouterProvider,
        STATE_DOODLE: string,
        STATE_EXAMPLES: string,
        STATE_GISTS: string
    ) {

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home.html',
                controller: 'home-controller'
            })
            .state(STATE_DOODLE, {
                url: '/doodle',
                templateUrl: 'doodle.html',
                controller: 'doodle-controller'
            })
            .state(STATE_EXAMPLES, {
                url: '/examples',
                templateUrl: 'examples.html',
                controller: 'examples-controller'
            })
            .state(STATE_GISTS, {
                url: '/' + STATE_GISTS + '/{gistId}',
                templateUrl: 'doodle.html',
                controller: 'doodle-controller'
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
                controller: 'about-controller'
            });

        $urlRouterProvider.otherwise('/');
    }]);


//
// Register work which should be performed when the injector is done loading all modules.
//
app.run([
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    'cookie',
    'uuid4',
    'ga',
    'githubKey',
    'version',
    function(
        $rootScope: AppScope,
        $state: angular.ui.IStateService,
        $stateParams: angular.ui.IStateParamsService,
        $window: Window,
        cookie: CookieService,
        uuid4: IUuidService,
        ga: UniversalAnalytics.ga,
        githubKey: string,
        version: string
    ) {

        // The name of this cookie must correspond with the cookie sent back from the server.
        const GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME = 'mathdoodle-github-application-client-id';
        const GITHUB_TOKEN_COOKIE_NAME = 'github-token';
        const GITHUB_LOGIN_COOKIE_NAME = 'github-login';
        const GITHUB_GET_LOGIN_OAUTH_AUTHORIZE = "https://github.com/login/oauth/authorize";

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope (HTML template) within the application.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.version = version;

        // Doing this twice is a hack for Firefox. It may not be required anymore.
        $window.applicationCache.addEventListener('updateready', function(e: Event) {
            $rootScope.$apply(function() {
                // Do nothing.
            });
        }, false);
        $window.onload = function() {
            $window.applicationCache.addEventListener('updateready', function(e: Event) {
                if ($window.applicationCache.status === $window.applicationCache.UPDATEREADY) {
                    BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_SUCCESS,
                        title: $("<h3>Update Ready</h3>"),
                        message: "A new version of mathdoodle is available. Would you like to use it now?",
                        /*closable: false,*/
                        /*closeByBackdrop: false,*/
                        /*closeByKeyboard: false,*/
                        buttons: [
                            {
                                label: "Yes, Now",
                                cssClass: 'btn btn-primary',
                                action: function(dialog: IBootstrapDialog) {
                                    $window.location.reload();
                                    dialog.close();
                                }
                            },
                            {
                                label: "No, Later",
                                cssClass: 'btn',
                                action: function(dialog: IBootstrapDialog) {
                                    dialog.close();
                                }
                            }
                        ]
                    });
                }
                else {
                    // Manifest didn't changed. Nothing new to server.
                }
            }, false);
        };
        $window.applicationCache.addEventListener('checking', function(e: Event) {
            $rootScope.$apply(function() {
                // Do nothing.
            });
        }, false);
        $window.applicationCache.addEventListener('noupdate', function(e: Event) {
            $rootScope.$apply(function() {
                // Do nothing.
            });
        }, false);
        $window.applicationCache.addEventListener('downloading', function(e: Event) {
            $rootScope.$apply(function() {
                // Do nothing.
            });
        }, false);
        $window.applicationCache.addEventListener('progress', function(e: Event) {
            $rootScope.$apply(function() {
                // Do nothing.
            });
        }, false);
        $window.applicationCache.addEventListener('cached', function(e: Event) {
            $rootScope.$apply(function() {
                // Do nothing.
            });
        }, false);
        $window.applicationCache.addEventListener('obsolete', function(e: Event) {
            $rootScope.$apply(function() {
                // Do nothing.
            });
        }, false);
        $window.applicationCache.addEventListener('error', function(e: Event) {
            $rootScope.$apply(function() {
                // Do nothing.
            });
        }, false);

        // If we don't specify where to go we'll get a blank screen!
        // $state.transitionTo('home');

        // The server drops this cookie so that we can make the GitHub autorization request.
        $rootScope.clientId = function() {
            return cookie.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME);
        };

        $rootScope.log = function(thing) {
            console.log(thing);
        };

        $rootScope.alert = function(thing) {
            alert(thing);
        };

        $rootScope.login = function(label?: string, value?: number) {
            ga('send', 'event', 'GitHub', 'login', label, value);
            // This is the beginning of the Web Application Flow for GitHub OAuth2.
            // The API now allows us to specify an unguessable random string called 'state'.
            // This 'state' string is used to protect against cross-site request forgery attacks.

            const pending = uuid4.generate();
            const githubURL = GITHUB_GET_LOGIN_OAUTH_AUTHORIZE +
                "?client_id=" + $rootScope.clientId() +
                "&amp;scope=user,gist" +
                "&amp;state=" + pending;

            // We effectively reset the GitHub property.
            const github: IGitHubItem = { oauth: { pending: pending } };
            $window.localStorage.setItem(githubKey, JSON.stringify(github));
            // Begin the GET request to GitHub.
            // Changing the browser URL appears to take you away from the app,
            // but the login redirects back to the server.
            $window.location.href = githubURL;
        };

        $rootScope.logout = function(label?: string, value?: number) {
            ga('send', 'event', 'GitHub', 'logout', label, value);
            cookie.removeItem(GITHUB_TOKEN_COOKIE_NAME);
            cookie.removeItem(GITHUB_LOGIN_COOKIE_NAME);
        };

        $rootScope.isLoggedIn = function() {
            return cookie.hasItem(GITHUB_TOKEN_COOKIE_NAME);
        };

        $rootScope.userLogin = function() {
            return cookie.getItem(GITHUB_LOGIN_COOKIE_NAME);
        };

    }]);

export default app;
