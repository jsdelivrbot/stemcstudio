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
import translateFilter from './modules/translate/filter/translate';
import TranslateProvider from './modules/translate/service/TranslateProvider';
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
import HitService from './services/hits/HitService';
import HomeController from './controllers/HomeController';
import editor from './directives/editor/editor.component';
import explorer from './directives/explorer/explorer.component';
import ExplorerFilesController from './directives/explorer/ExplorerFilesController';
import logoText from './directives/logoText/logoText';
import AlertController from './services/modalService/AlertController';
import ConfirmController from './services/modalService/ConfirmController';
import PromptController from './services/modalService/PromptController';
import ModalDialogService from './services/modalService/ModalDialogService';
import NaiveFlowSessionService from './services/flow/NaiveFlowSessionService';
import ReteFlowService from './services/flow/ReteFlowService';
import RepoController from './controllers/RepoController';
import RepoDataController from './services/cloud/RepoDataController';
import resizable from './directives/resizable/resizable';
import TextService from './services/text/TextService';
import TranslateController from './controllers/TranslateController';
import DefaultThemeManager from './services/themes/DefaultThemeManager';
import workspace from './directives/workspace/workspace.component';
import WorkspaceFactoryService from './services/workspace/WorkspaceFactoryService';

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
app.controller('translate-controller', TranslateController);

app.controller('ExplorerFilesController', ExplorerFilesController);

// Controllers for standard modal dialogs.
app.controller('AlertController', AlertController);
app.controller('ConfirmController', ConfirmController);
app.controller('PromptController', PromptController);

// Controllers for cloud service modal dialogs.
app.controller('ChooseGistOrRepoController', ChooseGistOrRepoController);
app.controller('CommitMessageController', CommitMessageController);
app.controller('RepoDataController', RepoDataController);

app.controller('RepoController', RepoController);
import './controllers/AboutController';
import './controllers/BodyController';
import './controllers/CopyController';
import './controllers/DownloadController';
import './controllers/ExamplesController';
import './controllers/HomeController';
import './controllers/NewController';
import './controllers/OpenController';
import './controllers/PropertiesController';

app.directive('contextMenu', contextMenu);
app.directive('editor', editor);
app.directive('explorer', explorer);
app.directive('logoText', logoText);
app.directive('resizable', resizable);
app.directive('workspace', workspace);

app.filter('contiguous', contiguous);
app.filter('translate', translateFilter);

import './fugly/ga/ga';

import './services/cookie/cookie';
import './services/doodles/doodles';
import './services/gham/GitHubAuthManager';
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

app.service('hits', HitService);

app.service('textService', TextService);
app.service('themeManager', DefaultThemeManager);
app.provider('$translate', new TranslateProvider());
app.service('workspaceFactory', WorkspaceFactoryService);

import './template-cache';

//
// Nothing happens unless we bootstrap the application.
//
angular.element(document).ready(function() {
    angular.bootstrap(document.documentElement, [app.name], { strictDi: true });
});
