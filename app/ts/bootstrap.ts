//
// We import the app so that we can bootstrap.
//
import app from './app';
import * as angular from 'angular';
import logoText from './directives/logoText/logoText';

//
// We import other Angular services that are needed by the Angular 'app' module.
// The ordering relative to the app is critical but works automatically using the System loader
// provided that the service imports the 'app' System module.
//
import './controllers/AboutController';
import './controllers/BodyController';
import './controllers/CopyController';
import './controllers/DoodleController';
import './controllers/DownloadController';
import './controllers/ExamplesController';
import './controllers/HomeController';
import './controllers/LoginController';
import './controllers/NewController';
import './controllers/OpenController';
import './controllers/PropertiesController';

import './directives/angular-resizable';
app.directive('logoText', logoText);

import './fugly/ga/ga';

import './services/cloud/cloud';
import './services/cookie/cookie';
import './services/doodles/doodles';
import './services/gham/GitHubAuthManager';
import './services/github/GitHub';
import './services/options/options';
import './services/settings/settings';
import './services/templates/templates';
import './services/tw/tw';
import './services/uuid/UuidService';

import './template-cache';

//
// Nothing happens unless we bootstrap the application.
//
angular.element(document).ready(function() {
    angular.bootstrap(document.documentElement, [app.name], { strictDi: true });
});
