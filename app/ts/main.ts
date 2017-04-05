//
// Why don't the latest Angular examples contain these imports?
//
import 'zone.js';
import 'reflect-metadata';
// You may need es6-shim if you get an error relating to list.fill

//
// I'm not sure why this import is required, but it is.
//
import 'angular';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { UpgradeModule } from '@angular/upgrade/static';
import { AppModule } from './app.module';
import { downgradeInjectable } from '@angular/upgrade/static';

//
// We import the app so that we can bootstrap.
//

/**
 * app is the top-level AnngularJS module.
 */
import app from './app';
//
// The remainder of this module defines various AngularJS components for the application.
// The very last few lines in this file bootstrap the app module.
//
import { BASE64_SERVICE_UUID } from './services/base64/IBase64Service';
import { Base64Service } from './services/base64/base64.service';
import { CLOUD_SERVICE_UUID } from './services/cloud/ICloudService';
import { CloudService } from './services/cloud/cloud.service';
import { COOKIE_SERVICE_UUID } from './services/cookie/ICookieService';
import { CookieService } from './services/cookie/cookie.service';
import { GITHUB_SERVICE_UUID } from './services/github/IGitHubService';
import { GitHubService } from './services/github/github.service';

import ChooseGistOrRepoController from './services/cloud/ChooseGistOrRepoController';
import CommitMessageController from './services/cloud/CommitMessageController';
import contextMenu from './directives/contextMenu/contextMenu.directive';
import contiguous from './filters/contiguous';
import CookbookController from './controllers/CookbookController';
import DashboardController from './controllers/DashboardController';
import DoodleController from './controllers/DoodleController';
import ExamplesController from './controllers/ExamplesController';
import GitHubAccountController from './controllers/GitHubAccountController';
import HomeController from './controllers/HomeController';
import TutorialsController from './controllers/TutorialsController';
import editorDirective1x from './directives/editor/editor.directive1x';
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
import workspace from './directives/workspace/workspace.component';

import { templateCache } from './template-cache';

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
app.controller('cookbook-controller', CookbookController);
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
app.directive('editor', editorDirective1x);
app.directive('explorer', explorer);
app.directive('problems', problems);
app.directive('resizable', resizable);
app.directive('workspace', workspace);

app.filter('contiguous', contiguous);

import './fugly/ga/ga';

// FIXME: Don't like this style of import.
import './services/doodles/doodleManager.service';
import './services/options/options';
import './services/templates/templates';

app.factory(BASE64_SERVICE_UUID, downgradeInjectable(Base64Service));
app.factory(COOKIE_SERVICE_UUID, downgradeInjectable(CookieService));
app.service(CLOUD_SERVICE_UUID, CloudService);
app.service(GITHUB_SERVICE_UUID, GitHubService);
app.service('modalDialog', ModalDialogService);

app.service('flow', ReteFlowService);
app.service('flowSessionService', NaiveFlowSessionService);

app.run(['$templateCache', templateCache]);

//
// Hybrid bootstrap running both AngularJS and Angular at the same time.
//
const bootstrapPromise = platformBrowserDynamic().bootstrapModule(AppModule);

bootstrapPromise.then(platformRef => {
    const upgrade = platformRef.injector.get(UpgradeModule) as UpgradeModule;
    // I'm not sure whether the strictDi option is doing anything here.
    upgrade.bootstrap(document.documentElement, [app.name], { strictDi: true });
});

bootstrapPromise.catch(function (reason) {
    console.error(reason);
});
