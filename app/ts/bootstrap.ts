//
// We import the app so that we can bootstrap.
//
import app from './app';
import * as angular from 'angular';
import contextMenu from './directives/contextMenu/contextMenu.directive';
import DoodleController from './controllers/DoodleController';
import editor from './directives/editor/editor.component';
import explorer from './directives/explorer/explorer.component';
import ExplorerFilesController from './directives/explorer/ExplorerFilesController';
import logoText from './directives/logoText/logoText';
import AlertController from './services/modalService/AlertController';
import ConfirmController from './services/modalService/ConfirmController';
import PromptController from './services/modalService/PromptController';
import ModalService from './services/modalService/ModalService';
import resizable from './directives/resizable/resizable';
import TextService from './services/text/TextService';
import workspace from './directives/workspace/workspace.component';

//
// We import other Angular services that are needed by the Angular 'app' module.
// The ordering relative to the app is critical but works automatically using the System loader
// provided that the service imports the 'app' System module.
//
app.controller('doodle-controller', DoodleController)
app.controller('ExplorerFilesController', ExplorerFilesController)
app.controller('AlertController', AlertController)
app.controller('ConfirmController', ConfirmController)
app.controller('PromptController', PromptController)
import './controllers/AboutController';
import './controllers/BodyController';
import './controllers/CopyController';
import './controllers/DownloadController';
import './controllers/ExamplesController';
import './controllers/HomeController';
import './controllers/LoginController';
import './controllers/NewController';
import './controllers/OpenController';
import './controllers/PropertiesController';

app.directive('contextMenu', contextMenu);
app.directive('editor', editor);
app.directive('explorer', explorer);
app.directive('logoText', logoText);
app.directive('resizable', resizable);
app.directive('workspace', workspace);

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
app.service('modalService', ModalService)
app.service('textService', TextService)

import './template-cache';

//
// Nothing happens unless we bootstrap the application.
//
angular.element(document).ready(function() {
    angular.bootstrap(document.documentElement, [app.name], { strictDi: true });
});
