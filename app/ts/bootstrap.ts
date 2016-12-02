//
// We import the app so that we can bootstrap.
//

/**
 * app is the top-level angular.IModule.
 */
import app from './app';
//
// The remainder of this module defines various AngularJS components for the application.
// The very last few lines in this file bootstrap the app module.
//
import * as angular from 'angular';
import Base64 from './services/base64/Base64';
import ChooseGistOrRepoController from './services/cloud/ChooseGistOrRepoController';
import CommitMessageController from './services/cloud/CommitMessageController';
import contextMenu from './directives/contextMenu/contextMenu.directive';
import contiguous from './filters/contiguous';
import DashboardController from './controllers/DashboardController';
import DoodleController from './controllers/DoodleController';
import ExamplesController from './controllers/ExamplesController';
import GitHubAccountController from './controllers/GitHubAccountController';
import GitHubCloudService from './services/cloud/GitHubCloudService';
import HomeController from './controllers/HomeController';
import TutorialsController from './controllers/TutorialsController';
import editor from './directives/editor/editor.component';
import explorer from './directives/explorer/explorer.component';
import ExplorerFilesController from './directives/explorer/ExplorerFilesController';
import problems from './directives/problems/problems.component';

// FIXME: This should be an internal module.
import AlertController from './services/modalService/AlertController';
import ConfirmController from './services/modalService/ConfirmController';
import PromptController from './services/modalService/PromptController';
import ShareController from './services/modalService/ShareController';
import ModalDialogService from './services/modalService/ModalDialogService';

import NaiveFlowSessionService from './services/flow/NaiveFlowSessionService';
import ReteFlowService from './services/flow/ReteFlowService';
import RepoController from './controllers/RepoController';
import RepoDataController from './services/cloud/RepoDataController';
import resizable from './directives/resizable/resizable';
import TextService from './services/text/TextService';
import workspace from './directives/workspace/workspace.component';

//
// We import other Angular services that are needed by the Angular 'app' module.
// The ordering relative to the app is critical but works automatically using the System loader
// provided that the service imports the 'app' System module.
//

//
// The (3) top-level controllers that participate in the routing.
//
app.controller('DashboardController', DashboardController);
app.controller('DoodleController', DoodleController);
/**
 * This is the entry point for the application.
 * It will be loaded by a System.import(...) call.
 * This is currently done using a Jade template.
 */
app.controller('examples-controller', ExamplesController);
app.controller('GitHubAccountController', GitHubAccountController);
app.controller('home-controller', HomeController);
app.controller('tutorials-controller', TutorialsController);

app.controller('ExplorerFilesController', ExplorerFilesController);

// Controllers for standard modal dialogs.
app.controller('AlertController', AlertController);
app.controller('ConfirmController', ConfirmController);
app.controller('PromptController', PromptController);
app.controller('ShareController', ShareController);

// Controllers for cloud service modal dialogs.
app.controller('ChooseGistOrRepoController', ChooseGistOrRepoController);
app.controller('CommitMessageController', CommitMessageController);
app.controller('RepoDataController', RepoDataController);

app.controller('RepoController', RepoController);
// FIXME: Don't like this style of import.
import './controllers/DownloadController';

app.directive('contextMenu', contextMenu);
app.directive('editor', editor);
app.directive('explorer', explorer);
app.directive('problems', problems);
app.directive('resizable', resizable);
app.directive('workspace', workspace);

app.filter('contiguous', contiguous);

import './fugly/ga/ga';

// FIXME: Don't like this style of import.
import './services/cookie/cookie';
import './services/doodles/doodles';
import './services/github/GitHub';
import './services/options/options';
import './services/settings/settings';
import './services/templates/templates';
// import './services/tw/tw';
import './services/uuid/UuidService';
app.service('base64', Base64);
app.service('cloud', GitHubCloudService);
app.service('modalDialog', ModalDialogService);

app.service('flow', ReteFlowService);
app.service('flowSessionService', NaiveFlowSessionService);

app.service('textService', TextService);

import './template-cache';

//
// Nothing happens unless we bootstrap the application.
//
angular.element(document).ready(function () {
    angular.bootstrap(document.documentElement, [app.name], { strictDi: true, debugInfoEnabled: true });
});
