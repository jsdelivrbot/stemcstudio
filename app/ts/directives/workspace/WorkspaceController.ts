import * as ng from 'angular';
import Base64Service from '../../services/base64/Base64Service';
import Delta from '../../widgets/editor/Delta';
import Editor from '../../widgets/editor/Editor';
import EditSession from '../../widgets/editor/EditSession';
import OutputFile from '../../widgets/editor/workspace/OutputFile';
import sd from 'showdown';
import CloudService from '../../services/cloud/CloudService';
import detect1x from './detect1x';
import Doodle from '../../services/doodles/Doodle';
import fileContent from './fileContent';
import fileExists from './fileExists';
import IDoodleManager from '../../services/doodles/IDoodleManager';
import GitHubReason from '../../services/github/GitHubReason';
import GitHubService from '../../services/github/GitHubService';
import IGitHubAuthManager from '../../services/gham/IGitHubAuthManager';
import IOption from '../../services/options/IOption';
import IOptionManager from '../../services/options/IOptionManager';
import isNumber from '../../utils/isNumber';
import isString from '../../utils/isString';
import ChangeHandler from './ChangeHandler';
import OutputFileHandler from './OutputFileHandler';
import doodleGroom from '../../utils/doodleGroom';
import readMeHTML from './readMeHTML';
import StringSet from '../../utils/StringSet';
import mathscript from 'davinci-mathscript';
import Method from './Method';
import ModalDialog from '../../services/modalService/ModalDialog';
import PromptOptions from '../../services/modalService/PromptOptions';
import RepoData from '../../services/github/RepoData';
import FlowService from '../../services/flow/FlowService';
import UploadFacts from './UploadFacts';
import WorkspaceScope from '../../scopes/WorkspaceScope';
import WorkspaceMixin from '../editor/WorkspaceMixin';
import Workspace from '../../services/workspace/Workspace';
import WorkspaceFactory from '../../services/workspace/WorkspaceFactory';
import {LANGUAGE_CSS} from '../../languages/modes';
import {LANGUAGE_HTML} from '../../languages/modes';
import {LANGUAGE_JSON} from '../../languages/modes';
import {LANGUAGE_JAVA_SCRIPT} from '../../languages/modes';
import {LANGUAGE_LESS} from '../../languages/modes';
import {LANGUAGE_MARKDOWN} from '../../languages/modes';
import {LANGUAGE_TYPE_SCRIPT} from '../../languages/modes';
import {LANGUAGE_TEXT} from '../../languages/modes';

// import BootstrapDialog from 'bootstrap-dialog';

const FSLASH_STAR = '/*';
const STAR_FSLASH = '*/';

const WAIT_NO_MORE = 0;
const WAIT_FOR_MORE_CODE_KEYSTROKES = 1500;
const WAIT_FOR_MORE_OTHER_KEYSTROKES = 350;
const WAIT_FOR_MORE_README_KEYSTROKES = 1000;
// const WAIT_FOR_STATE_CHANGES = 100;

const MODULE_KIND_NONE = 'none';
const MODULE_KIND_SYSTEM = 'system';
const SCRIPT_TARGET_ES5 = 'es5';

function namesToOptions(names: string[], options: IOptionManager): IOption[] {
    return options.filter(function(option) { return names.indexOf(option.name) >= 0; });
}

function optionsToNames(options: IOption[]): string[] {
    return options.map(function(option: IOption) { return option.name; });
}

/**
 * Compute the closure of the options.
 */
function closure(options: IOption[], manager: IOptionManager): IOption[] {
    const nameSet = new StringSet();
    options.forEach(function(option) {
        nameSet.add(option.name);
    });
    let done = false;
    while (!done) {
        const size = nameSet.size();
        // TODO: This only computes the closure. It does not sort into for dependencies.
        namesToOptions(nameSet.toArray(), manager).forEach(function(option: IOption) {
            for (let name in option.dependencies) {
                if (option.dependencies.hasOwnProperty(name)) {
                    nameSet.add(name);
                }
            }
        });

        done = size === nameSet.size();
    }
    return namesToOptions(nameSet.toArray(), manager);
}

/**
 * Returns the JavaScript to be inserted into the HTML script element.
 * This may involve further modifying the JavaScript emitted by the
 * TypeScript compiler by, for example, introducing operator overloading. 
 */
function currentJavaScript(fileName: string, doodle: Doodle): string {
    const code = doodle.lastKnownJs[fileName];
    if (code) {
        if (doodle.operatorOverloading) {
            try {
                // In this location we are transpiling the code.
                return mathscript.transpile(code);
            }
            catch (e) {
                // We might end up here if there is an error in the source code.
                // TODO: Distinguish errors in transpile from errors in source code.
                console.warn(e);
                return code;
            }
        }
        else {
            return code;
        }
    }
    else {
        return "";
    }
}

/**
 * This will be a String method in ECMAScript 6.
 * More robust implementations exist.
 * This lightweight function is adapted from MDN.
 */
function startsWith(sourceString: string, searchString: string, position = 0): boolean {
    return sourceString.indexOf(searchString, position) === position;
}

/**
 * Computes the URL for a script tag by examining the `fileName`.
 * Files that begin with the special VENDOR_FOLDER_MARKER constant
 * are assumed to be located in the local `vendor` folder of the domain.
 * Otherwise, the fileName is considered to be the URL of a remote server.
 */
function scriptURL(domain: string, fileName: string, VENDOR_FOLDER_MARKER: string): string {
    if (startsWith(fileName, VENDOR_FOLDER_MARKER)) {
        // fileName(s) should be defined as VENDOR_FOLDER_MARKER + '/package/**/*.js'
        return domain + '/vendor' + fileName.substring(VENDOR_FOLDER_MARKER.length);
    }
    else {
        // TODO: While we migrate options, everything is still local.
        return domain + '/js/' + fileName;
    }
}


// The iframe will capture the mouse events that we need to
// resize the output widow. This function
function bubbleIframeMouseMove(iframe: HTMLIFrameElement) {
    // Save any previous onmousemove handler.
    const existingOnMouseMove = iframe.contentWindow.onmousemove;

    // Attach a new onmousemove listener.
    iframe.contentWindow.onmousemove = function(e: MouseEvent) {
        // Fire any existing onmousemove listener.
        if (existingOnMouseMove) existingOnMouseMove(e);

        // Create a new event for the this window.
        const evt: MouseEvent = document.createEvent("MouseEvents");

        // We'll need this to offset the mouse move appropriately.
        const boundingClientRect = iframe.getBoundingClientRect();

        // Initialize the event, copying exiting event values (most of them).
        evt.initMouseEvent(
            "mousemove",
            true, // bubbles
            false, // not cancelable 
            window,
            e.detail,
            e.screenX,
            e.screenY,
            e.clientX + boundingClientRect.left,
            e.clientY + boundingClientRect.top,
            e.ctrlKey,
            e.altKey,
            e.shiftKey,
            e.metaKey,
            e.button,
            null // no related element
        );

        // Dispatch the mousemove event on the iframe element.
        iframe.dispatchEvent(evt);
    };
}

/**
 * @class WorkspaceController
 */
export default class WorkspaceController implements WorkspaceMixin {
    /**
     *
     */
    public static $inject: string[] = [
        '$scope',
        '$state',
        '$stateParams',
        '$http',
        '$location',
        '$timeout',
        '$window',
        'base64',
        'GitHub',
        'GitHubAuthManager',
        'cloud',
        'templates',
        'flow',
        'ga',
        'doodles',
        'modalDialog',
        'options',
        'FEATURE_GIST_ENABLED',
        'FEATURE_REPO_ENABLED',
        'FILENAME_README',
        'FILENAME_CODE',
        'FILENAME_LIBS',
        'FILENAME_LESS',
        'FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS',
        'FILENAME_TYPESCRIPT_CURRENT_LIB_DTS',
        'STATE_GIST',
        'STATE_REPO',
        'STYLE_MARKER',
        'STYLES_MARKER',
        'SCRIPTS_MARKER',
        'CODE_MARKER',
        'LIBS_MARKER',
        'VENDOR_FOLDER_MARKER',
        'workspaceFactory'];

    /**
     * Keep track of the dependencies that are loaded in the workspace.
     */
    private olds: string[] = [];

    private outputFilesEventHandlers: { [name: string]: OutputFileHandler } = {};
    private changeHandlers: { [name: string]: ChangeHandler } = {};

    /**
     * Promise to update the README view for throttling.
     */
    private readmePromise: angular.IPromise<void>;
    /**
     * Keep track of the README handlers that are registered for cleanup.
     */
    private readmeChangeHandlers: { [name: string]: ChangeHandler } = {};

    private editors: { [name: string]: Editor } = {};
    private resizeListener: (unused: UIEvent) => any;

    /**
     * Keep track of watches so that we can clean them up.
     */
    private watches: (() => any)[] = [];

    /**
     * The workspace lives within the lifetime of the controller.
     * We create it during $onInit and release it during $onDestroy using the injected WorkspaceFactory.
     * By bounding the lifetime we ensure proper thread termination.
     */
    private workspace: Workspace;

    /**
     * @class WorkspaceController
     * @constructor
     * @param $scope {WorkspaceScope}
     */
    constructor(
        private $scope: WorkspaceScope,
        private $state: angular.ui.IStateService,
        private $stateParams: angular.ui.IStateParamsService,
        private $http: angular.IHttpService,
        private $location: angular.ILocationService,
        private $timeout: angular.ITimeoutService,
        private $window: angular.IWindowService,
        private base64: Base64Service,
        private github: GitHubService,
        authManager: IGitHubAuthManager,
        private cloud: CloudService,
        templates: Doodle[],
        private flowService: FlowService,
        ga: UniversalAnalytics.ga,
        private doodles: IDoodleManager,
        private modalDialog: ModalDialog,
        private options: IOptionManager,
        private FEATURE_GIST_ENABLED: boolean,
        private FEATURE_REPO_ENABLED: boolean,
        private FILENAME_README: string,
        private FILENAME_CODE: string,
        private FILENAME_LIBS: string,
        private FILENAME_LESS: string,
        private FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS: string,
        private FILENAME_TYPESCRIPT_CURRENT_LIB_DTS: string,
        private STATE_GIST: string,
        private STATE_REPO: string,
        private STYLE_MARKER: string,
        private STYLES_MARKER: string,
        private SCRIPTS_MARKER: string,
        private CODE_MARKER: string,
        private LIBS_MARKER: string,
        private VENDOR_FOLDER_MARKER: string,
        private workspaceFactory: WorkspaceFactory) {

        let rebuildPromise: angular.IPromise<void>;
        $scope.updatePreview = (delay: number) => {
            if (rebuildPromise) { $timeout.cancel(rebuildPromise); }
            rebuildPromise = $timeout(() => { this.rebuildPreview(); rebuildPromise = undefined; }, delay);
        };

        $scope.doView = (name: string): void => {
            const doodle = doodles.current();
            const file = doodle.findFileByName(name);
            if (file) {
                doodle.setPreviewFile(name);
                // The user probably wants to see the view, so make sure the view is visible.
                $scope.isViewVisible = true;
                $scope.updatePreview(WAIT_NO_MORE);
            }
        };

        $scope.toggleMode = function(label?: string, value?: number) {
            // Is this dead code?
            ga('send', 'event', 'doodle', 'toggleMode', label, value);
            $scope.isEditMode = !$scope.isEditMode;
            // Ensure the preview is running when going away from editing.
            if (!$scope.isEditMode) {
                $scope.isViewVisible = true;
                $scope.updatePreview(WAIT_NO_MORE);
            }
            else {
                if ($scope.isViewVisible) {
                    $scope.updatePreview(WAIT_NO_MORE);
                }
            }
        };

        $scope.toggleView = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'toggleView', label, value);
            $scope.isViewVisible = !$scope.isViewVisible;
            $scope.updatePreview(WAIT_NO_MORE);
        };

        $scope.toggleReadMeVisible = (label?: string, value?: number) => {
            ga('send', 'event', 'doodle', 'toggleReadMeVisible', label, value);
            $scope.isReadMeVisible = !$scope.isReadMeVisible;
            this.updateReadmeView(WAIT_NO_MORE);
        };

        $scope.doUpload = (label?: string, value?: number) => {
            ga('send', 'event', 'doodle', 'upload', label, value);

            /**
             * The tile of the flow that will provide context in any dialogs.
             */
            const title = "Upload";
            const doodle = this.doodles.current();

            const flow = this.flowService.createFlow<UploadFacts>(title);

            flow.rule("Commit Message", {},
                (facts) => {
                    if (this.FEATURE_REPO_ENABLED) {
                        return facts.canAskForCommitMessage();
                    }
                    else {
                        return false;
                    }
                },
                (facts, session, next) => {
                    this.cloud.commitMessage(`${title}`).then((commitMessage) => {
                        facts.commitMessage.resolve(commitMessage);
                        next();
                    }, (reason) => {
                        facts.commitMessage.reject(reason);
                        next(reason);
                    });
                });

            flow.rule("Choose Gist or Repo", {},
                (facts) => {
                    if (this.FEATURE_GIST_ENABLED && this.FEATURE_REPO_ENABLED) {
                        return facts.canAskToChooseGistOrRepo();
                    }
                    else {
                        return false;
                    }
                },
                (facts, session, next) => {
                    cloud.chooseGistOrRepo(title).then((storage) => {
                        facts.storage.resolve(storage);
                        next();
                    }, (reason) => {
                        facts.storage.reject(reason);
                        next(reason);
                    });
                });

            flow.rule("Create Gist", {},
                (facts) => {
                    if (this.FEATURE_GIST_ENABLED) {
                        return facts.canCreateGist();
                    }
                    else {
                        return false;
                    }
                },
                (facts, session, next) => {
                    this.cloud.createGist(doodle)
                        .then((http) => {
                            const status = http.status;
                            facts.status.resolve(status);
                            facts.statusText.resolve(http.statusText);
                            switch (status) {
                                case 201: {
                                    const data = http.data;
                                    facts.gistId.resolve(data.id);
                                    facts.uploadedAt.resolve(data.created_at);
                                    facts.redirect.resolve(true);
                                    facts.uploadMessage.resolve(`Your project was successfully uploaded and associated with a new Gist.`);

                                    doodle.gistId = data.id;
                                    doodle.created_at = data.created_at;
                                    doodle.updated_at = data.updated_at;

                                    doodles.updateStorage();

                                    next();
                                    break;
                                }
                                default: {
                                    const reason = `Unexpected HTTP status (${status})`;
                                    facts.uploadedAt.reject(reason);
                                    next(reason);
                                }
                            }
                        })
                        .catch((reason) => {
                            facts.uploadedAt.reject(reason);
                            next(reason);
                        });
                });

            flow.rule("Update Gist", {},
                (facts) => {
                    if (this.FEATURE_GIST_ENABLED) {
                        return facts.canUpdateGist();
                    }
                    else {
                        return false;
                    }
                },
                (facts, session, next) => {
                    this.cloud.updateGist(doodle, doodle.gistId)
                        .then((http) => {
                            const status = http.status;
                            const statusText = http.statusText;
                            facts.status.resolve(status);
                            facts.statusText.resolve(statusText);
                            switch (status) {
                                case 200: {
                                    const data = http.data;
                                    facts.uploadedAt.resolve(data.updated_at);
                                    facts.uploadMessage.resolve(`Your project was successfully uploaded and patched the existing Gist.`);
                                    doodle.emptyTrash();
                                    doodle.updated_at = data.updated_at;
                                    doodles.updateStorage();
                                    next();
                                    break;
                                }
                                case 404: {
                                    // The Gist no longer exists on GitHub
                                    // TODO: Test this we may end up down in the catch.
                                    doodle.gistId = void 0;
                                    facts.gistId.reset();
                                    doodles.updateStorage();
                                    next();
                                    break;
                                }
                                default: {
                                    const reason = `Unexpected HTTP status (${status})`;
                                    facts.uploadedAt.reject(reason);
                                    next(reason);
                                }
                            }
                        })
                        .catch((reason: GitHubReason) => {
                            switch (reason.status) {
                                case 404: {
                                    // The Gist no longer exists on GitHub.
                                    // More likely the  case that the user does not have authority to update someone else's Gist. 
                                    facts.gistExists.resolve(false);
                                    facts.uploadedAt.reject(reason.statusText);
                                    next(reason.statusText);
                                    break;
                                }
                                default: {
                                    facts.uploadedAt.reject(reason.statusText);
                                    next(reason.statusText);
                                }
                            }
                        });
                });

            flow.rule("Prompt for repository name", {},
                (facts) => {
                    if (this.FEATURE_REPO_ENABLED) {
                        return facts.canAskForRepoName();
                    }
                    else {
                        return false;
                    }
                },
                (facts, session, next) => {
                    const message = "Please enter the name of the repository that you would like to upload to.";
                    const options: PromptOptions = { title, message, text: '', placeholder: 'my-repository' };
                    this.modalDialog.prompt(options)
                        .then((repo) => {
                            facts.repo.resolve(repo);
                            next();
                        })
                        .catch((reason) => {
                            next(reason);
                        });
                });

            flow.rule("Determine whether repository exists", {},
                (facts) => {
                    if (this.FEATURE_REPO_ENABLED) {
                        return facts.canDetermineRepoExists();
                    }
                    else {
                        return false;
                    }
                },
                (facts, session, next) => {
                    this.github.getRepo(facts.userLogin.value, facts.repo.value)
                        .then((http) => {
                            const status = http.status;
                            facts.status.resolve(status);
                            facts.statusText.resolve(http.statusText);
                            switch (status) {
                                case 404: {
                                    facts.repoExists.resolve(false);
                                    next();
                                    break;
                                }
                                case 200: {
                                    facts.repoExists.resolve(true);
                                    const repo = http.data;
                                    facts.repoId.resolve(repo.id);
                                    next();
                                    break;
                                }
                                default: {
                                    const reason = `Unexpected HTTP status (${status})`;
                                    facts.uploadedAt.reject(reason);
                                    next(reason);
                                }
                            }
                        })
                        .catch((reason) => {
                            if (isNumber(reason.status)) {
                                const status: number = reason.status;
                                switch (status) {
                                    case 404: {
                                        facts.repoExists.resolve(false);
                                        next();
                                        break;
                                    }
                                    default: {
                                        const reason = `Unexpected HTTP status (${status})`;
                                        facts.uploadedAt.reject(reason);
                                        next(reason);
                                    }
                                }
                            }
                            else {
                                facts.repoExists.reject(reason);
                                next(reason);
                            }
                        });
                });

            flow.rule("Prompt for repository data", {},
                (facts) => {
                    if (this.FEATURE_REPO_ENABLED) {
                        return facts.canAskForRepoData();
                    }
                    else {
                        return false;
                    }
                },
                (facts, session, next) => {
                    const defaults: RepoData = { name: '' };
                    defaults.auto_init = true;
                    this.cloud.repoData(title, defaults)
                        .then((repoData) => {
                            facts.repoData.resolve(repoData);
                            next();
                        })
                        .catch((reason) => {
                            facts.repoData.reject(reason);
                            next(reason);
                        });
                });

            flow.rule("Create Repo", {},
                (facts) => {
                    if (this.FEATURE_REPO_ENABLED) {
                        return facts.canCreateRepo();
                    }
                    else {
                        return false;
                    }
                },
                (facts, session, next) => {
                    this.cloud.createRepo(facts.repoData.value)
                        .then((http) => {
                            const status = http.status;
                            facts.status.resolve(status);
                            facts.statusText.resolve(http.statusText);
                            const repository = http.data;
                            facts.repoId.resolve(repository.id);
                            facts.repo.resolve(repository.name);
                            facts.repoExists.resolve(true);
                            facts.owner.resolve(repository.owner.login);
                            facts.ref.resolve('heads/master');
                            next();
                        })
                        .catch((reason: GitHubReason) => {
                            facts.status.resolve(reason.status);
                            facts.statusText.resolve(reason.statusText);
                            switch (reason.status) {
                                case 422: {
                                    // It already exists. We didn't learn anything about the repository
                                    // other than that it exists.
                                    facts.repoExists.resolve(true);
                                    // FIXME: There's some duplication here in the repo name.
                                    facts.repo.resolve(facts.repoData.value.name);
                                    // Change our strategy to perform an update.
                                    facts.method.resolve(Method.Update);
                                    facts.owner.resolve(facts.userLogin.value);
                                    facts.ref.resolve('heads/master');
                                    next();
                                    break;
                                }
                                default: {
                                    next(reason);
                                }
                            }
                        });
                });

            flow.rule("Upload to Repo", {},
                (facts) => {
                    if (this.FEATURE_REPO_ENABLED) {
                        return facts.canUploadToRepo();
                    }
                    else {
                        return false;
                    }
                },
                (facts, session, next) => {
                    const owner = facts.owner.value;
                    const repo = facts.repo.value;
                    const ref = facts.ref.value;
                    const commitMessage = facts.commitMessage.value;
                    this.cloud.uploadToRepo(doodle, owner, repo, ref, commitMessage, (err, details) => {
                        if (!err) {
                            if (details.refUpdate.isResolved()) {
                                doodle.owner = owner;
                                doodle.repo = repo;
                                // doodle.ref = ref;
                                facts.uploadMessage.resolve("Your project was successfully uploaded.");
                            }
                            else {
                                facts.uploadMessage.resolve("Your project didn't make it to GitHub!");
                            }
                        }
                        else {
                            facts.uploadMessage.reject(err);
                        }
                        next(err);
                    });
                });

            const facts = new UploadFacts();

            facts.gistId.resolve(doodle.gistId);
            facts.repo.resolve(doodle.repo);
            facts.owner.resolve(doodle.owner);
            facts.userLogin.resolve($scope.userLogin());
            if (this.FEATURE_GIST_ENABLED) {
                if (this.FEATURE_REPO_ENABLED) {
                    if (facts.gistId.isResolved()) {
                        facts.storage.resolve('gist');
                    }
                    if (facts.repo.isResolved()) {
                        facts.storage.resolve('repo');
                        facts.ref.resolve('heads/master');
                        facts.repoExists.resolve(true);
                    }
                }
                else {
                    facts.storage.resolve('gist');
                }
            }
            else {
                if (this.FEATURE_REPO_ENABLED) {
                    facts.storage.resolve('repo');
                    facts.ref.resolve('heads/master');
                }
                else {
                    // Do nothing.
                }
            }
            if (facts.gistId.isUndefined() && facts.repo.isUndefined()) {
                facts.method.resolve(Method.Create);
            }
            else {
                facts.method.resolve(Method.Update);
            }

            const session = flow.createSession(facts);
            session.execute((reason: any, facts: UploadFacts) => {
                if (reason) {
                    this.modalDialog.alert({ title, message: `The upload was aborted because of ${JSON.stringify(reason, null, 2)}.` });
                }
                else {
                    if (facts.uploadMessage.isResolved()) {
                        this.modalDialog.alert({ title, message: facts.uploadMessage.value });
                        if (facts.redirect.isResolved()) {
                            if (facts.gistId.isResolved()) {
                                this.$state.go(this.STATE_GIST, { gistId: doodle.gistId });
                            }
                            else if (facts.owner.isResolved() && facts.repo.isResolved()) {
                                this.$state.go(this.STATE_REPO, { owner: doodle.owner, repo: doodle.repo });
                            }
                            else {
                                // FIXME: redirect should contain it's own instructions.
                            }
                        }
                    }
                    else {
                        this.modalDialog.alert({ title, message: `Apologies, the upload was not completed because of a system error.` });
                    }
                }
            });
        };
    }

    /**
     * This lifecycle hook will be executed when all controllers on an element have been constructed,
     * and after their bindings are initialized. This hook is meant to be used for any kind of
     * initialization work of a controller.
     *
     * @method $onInit
     * @return {void}
     */
    $onInit(): void {
        // WARNING: Make sure that workspace create and release are balanced across $onInit and $onDestroy.
        this.workspace = this.workspaceFactory.createWorkspace();
        // this.workspace.trace = true;
        // this.workspace.setTrace(true);
        this.workspace.setDefaultLibrary('/typings/lib.es6.d.ts');


        const doodles = this.doodles;
        // Ensure that there is a current doodle i.e. doodles.current() exists.
        if (doodles.length === 0) {
            // If there is no document, construct one based upon the first template.
            // FIXME: Bit of a smell here. $scope.templates is from a different controller.
            doodles.createDoodle(this.$scope.templates[0], "STEMCstudio");
        }

        // Perform conversions required for doodle evolution.
        const doodle = doodleGroom(doodles.current());

        // Following a browser refresh, show the code so that it refreshes correctly (bug).
        // This also side-steps the issue of the time it takes to restart the preview.
        // Ideally we remove this line and use the cached `lastKnownJs` to provide the preview.
        doodle.isCodeVisible = true;

        // Now that things have settled down...
        doodles.updateStorage();

        const owner: string = this.$stateParams['owner'];
        const repo: string = this.$stateParams['repo'];
        const gistId: string = this.$stateParams['gistId']; // OK

        const matches = doodles.filter(function(doodle: Doodle) {
            if (isString(owner) && isString(repo)) {
                return doodle.owner === owner && doodle.repo === repo;
            }
            else if (isString(gistId)) {
                return doodle.gistId === gistId;
            }
            else {
                return false;
            }
        });
        if (matches.length > 0) {
            // We certainly don't want to overwrite anything in local storage.
            // The use should be advised ant then may delete manually from local storage.
            const match = matches[0];
            doodles.makeCurrent(match);
            // We can also assume that we are already in the correct state.
            this.onInitDoodle(match);
        }
        else {
            if (owner && repo) {
                this.cloud.downloadTree(owner, repo, 'heads/master')
                    .then((doodle) => {
                        doodles.unshift(doodle);
                        doodles.updateStorage();
                        this.onInitDoodle(doodle);
                    }, (reason) => {
                        this.modalDialog.alert({
                            title: 'Error downloading Repository',
                            message: `Error attempting to download repository '${repo}'. Cause:  ${reason}` });
                    }, function(state) {
                        // The state is {doneCount: number; todoCount: number}
                    });
            }
            else if (gistId) {
                this.cloud.downloadGist(gistId, (err: any, doodle: Doodle) => {
                    if (!err) {
                        doodles.unshift(doodle);
                        doodles.updateStorage();
                        this.onInitDoodle(doodle);
                    }
                    else {
                        this.modalDialog.alert({
                            title: 'Error downloading Gist',
                             message: `Error attempting to download gist '${gistId}'. Cause:  ${err}` });
                    }
                });
            }
            else {
                // We don't need to load anything, but are we in the correct state for the Doodle?
                // We end up here, e.g., when user presses Cancel from New dialog.
                if (this.FEATURE_GIST_ENABLED && doodle.gistId) {
                    this.$state.go(this.STATE_GIST, { gistId: doodle.gistId });
                }
                else if (this.FEATURE_REPO_ENABLED && doodle.owner && doodle.repo) {
                    this.$state.go(this.STATE_REPO, { owner: doodle.owner, repo: doodle.repo });
                }
                else {
                    this.onInitDoodle(doodle);
                }
            }
        }

        this.watches.push(this.$scope.$watch('isViewVisible', (newVal: boolean, oldVal, unused: angular.IScope) => {
            doodles.current().isViewVisible = this.$scope.isViewVisible;
            doodles.updateStorage();
        }));

        this.watches.push(this.$scope.$watch('isEditMode', (newVal: boolean, oldVal, unused: angular.IScope) => {
            doodles.current().isCodeVisible = this.$scope.isEditMode;
            doodles.updateStorage();
        }));
    }

    /**
     * This hook allows us to react to changes of one-way bindings of a component.
     * It is also called before $onInit the first time!
     */
    $onChanges(changes): void {
        // Do nothing.
    }

    /**
     * $onDestroy() is a hook that is called when its containing scope is destroyed.
     * We can use this hook to release external resources, watches and event handlers.
     *
     * @method $onDestroy
     * @return {void}
     */
    $onDestroy(): void {

        // Cancel all of the watches.
        for (let w = 0; w < this.watches.length; w++) {
            const watch = this.watches[w];
            watch();
        }

        // This method is called BEFORE the child directives make their detachEditor calls.
        // That means that we cannot set this reference to undefined because it will break
        // the detach callback.
        // TODO: Maybe implement something along the lines of refrence counting because the
        // workspace is shared?
        this.workspace.terminate();

        this.$window.removeEventListener('resize', this.resizeListener);
    }

    /**
     * 
     */
    private onInitDoodle(doodle: Doodle): void {

        this.resizeListener = (unused: UIEvent) => {
            this.resize();
        };

        this.$window.addEventListener('resize', this.resizeListener);

        // Event generated by the grabbar when resize starts.
        this.$scope.$on('angular-resizable.resizeStart', (event: ng.IAngularEvent, data) => {
            // Do nothing.
        });

        // Event generated by the grabbar while resize is happening.
        this.$scope.$on('angular-resizable.resizing', (event: ng.IAngularEvent, data) => {
            // Do nothing to make the sizing smoother.
            // The resize will happen at the end.
        });

        // Event generated by the grabbar when resize ends.
        this.$scope.$on('angular-resizable.resizeEnd', (event: ng.IAngularEvent, data) => {
            // Force the editors to resize after the grabbar has stopped so
            // that the editor knows where its boundaries are. If we don't do this,
            // placing the mouse cursor can cause the editor to jump because it thinks
            // the cursor is not visible.
            this.resize();
        });

        this.resize();

        this.$scope.doodleLoaded = true;

        // Bit of a smell here. Should we be updating the scope?
        this.$scope.isEditMode = doodle.isCodeVisible;
        // Don't start in Playing mode in case the user has a looping program (give chance to fix the code).
        this.$scope.isViewVisible = false;
        // No such issue with the README.md
        this.$scope.isReadMeVisible = true;

        // FIXME: Some work to do in getting all the async work done right.
        this.updateWorkspace();

        // Set the module kind for transpilation consistent with the version.
        const moduleKind = detect1x(doodle) ? MODULE_KIND_NONE : MODULE_KIND_SYSTEM;
        this.workspace.setModuleKind(moduleKind);

        // Set the script target for transpilation consistent with the version.
        const scriptTarget = detect1x(doodle) ? SCRIPT_TARGET_ES5 : SCRIPT_TARGET_ES5;
        this.workspace.setScriptTarget(scriptTarget);

        this.workspace.synchronize()
            .then(() => {
                // FIXME: Need a callback here...
                this.workspace.outputFiles();
                this.$scope.workspaceLoaded = true;
                this.$scope.updatePreview(WAIT_NO_MORE);
            })
            .catch((reason: any) => {
                console.warn(`Unable to synchronize the workspace because ${reason}.`);
            });
    }

    /**
     * Doe what needs to be done when the window is resized.
     */
    private resize(): void {
        const fileNames = Object.keys(this.editors);
        const iLen = fileNames.length;
        for (let i = 0; i < iLen; i++) {
            const fileName = fileNames[i];
            const editor = this.editors[fileName];
            editor.resize(true);
        }
    }

    /**
     * @method attachEditor
     * @param filename {string}
     * @param mode {string}
     * @param editor {Editor}
     * @return {void}
     */
    attachEditor(filename: string, mode: string, editor: Editor): void {
        switch (mode) {
            case LANGUAGE_TYPE_SCRIPT: {
                this.workspace.attachEditor(filename, editor);
                editor.getSession().on('outputFiles', this.createOutputFilesEventHandler(filename));
                break;
            }
            case LANGUAGE_JAVA_SCRIPT: {
                // TODO: We probably don't get anything for JavaScript.
                this.workspace.attachEditor(filename, editor);
                editor.getSession().on('outputFiles', this.createOutputFilesEventHandler(filename));
                break;
            }
            case LANGUAGE_CSS:
            case LANGUAGE_JSON:
            case LANGUAGE_HTML:
            case LANGUAGE_LESS:
            case LANGUAGE_TEXT: {
                editor.getSession().on('change', this.createChangeHandler(filename));
                break;
            }
            case LANGUAGE_MARKDOWN: {
                this.addReadmeChangeHandler(filename, editor);
                break;
            }
            default: {
                console.warn(`attachEditor(mode => ${mode}) is being ignored.`);
            }
        }
        this.editors[filename] = editor;
        // The editors are attached after $onInit and so we miss the initial resize.
        editor.resize(true);
    }

    /**
     * Creates the handler function used to respond to (transpiled) 'outputFiles' events from the editor.
     * The handler function is cached so that it can be removed when the editor is detached from the workspace.
     *
     * @method createOutputFilesEventHandler
     * @param filename {string}
     * @return {OutputFilesHandler}
     */
    private createOutputFilesEventHandler(filename: string): OutputFileHandler {
        const handler = (event: { data: OutputFile[] }, session: EditSession) => {
            // It's OK to capture the current Doodle here, but not outside the handler!
            const doodle = this.doodles.current();
            const outputFiles = event.data;
            outputFiles.forEach((outputFile: OutputFile) => {
                if (typeof doodle.lastKnownJs !== 'object') {
                    doodle.lastKnownJs = {};
                }
                // TODO: The output files could be both JavaScript and d.ts
                // We should be sure to only select the JavaScript file. 
                if (doodle.lastKnownJs[filename] !== outputFile.text) {
                    // if (this.cascade) {
                    doodle.lastKnownJs[filename] = outputFile.text;
                    this.doodles.updateStorage();
                    this.$scope.updatePreview(WAIT_FOR_MORE_CODE_KEYSTROKES);
                    // }
                }
            });
        };
        this.outputFilesEventHandlers[filename] = handler;
        return handler;
    }

    private deleteOutputFileHandler(filename) {
        delete this.outputFilesEventHandlers[filename];
    }

    private createChangeHandler(filename: string): ChangeHandler {
        const handler = (delta: Delta, session: EditSession) => {
            if (this.doodles.current()) {
                this.doodles.updateStorage();
                this.$scope.updatePreview(WAIT_FOR_MORE_OTHER_KEYSTROKES);
            }
        };
        this.changeHandlers[filename] = handler;
        return handler;
    }

    private createReadmeChangeHandler(filename: string): ChangeHandler {
        const handler = (delta: Delta, session: EditSession) => {
            if (this.doodles.current()) {
                this.doodles.updateStorage();
                this.updateReadmeView(WAIT_FOR_MORE_README_KEYSTROKES);
            }
        };
        this.readmeChangeHandlers[filename] = handler;
        return handler;
    }

    private updateReadmeView(delay: number) {
        // Throttle the requests to update the README view.
        if (this.readmePromise) { this.$timeout.cancel(this.readmePromise); }
        this.readmePromise = this.$timeout(() => { this.rebuildReadmeView(); this.readmePromise = undefined; }, delay);
    }

    private deleteChangeHandler(filename: string): void {
        delete this.changeHandlers[filename];
    }

    private addReadmeChangeHandler(filename: string, editor: Editor): void {
        if (this.readmeChangeHandlers[filename]) {
            console.warn(`NOT Expecting to find a README change handler for file ${filename}.`);
            return;
        }
        const handler = this.createReadmeChangeHandler(filename);
        editor.getSession().on('change', handler);
        this.readmeChangeHandlers[filename] = handler;
    }

    private removeReadmeChangeHandler(filename: string, editor: Editor): void {
        const handler = this.readmeChangeHandlers[filename];
        if (handler) {
            editor.getSession().off('change', handler);
            delete this.readmeChangeHandlers[filename];
        }
        else {
            console.warn(`Expecting to find a README change handler for file ${filename}.`);
        }
    }

    /**
     * @method detachEditor
     * @param filename {string}
     * @param mode {string}
     * @param editor {Editor}
     * @return {void}
     */
    detachEditor(filename: string, mode: string, editor: Editor): void {
        switch (mode) {
            case LANGUAGE_TYPE_SCRIPT: {
                const handler = this.outputFilesEventHandlers[filename];
                editor.getSession().off('outputFiles', handler);
                this.deleteOutputFileHandler(filename);
                this.workspace.detachEditor(filename, editor);
                break;
            }
            case LANGUAGE_JAVA_SCRIPT: {
                const handler = this.outputFilesEventHandlers[filename];
                editor.getSession().off('outputFiles', handler);
                this.deleteOutputFileHandler(filename);
                this.workspace.detachEditor(filename, editor);
                break;
            }
            case LANGUAGE_CSS:
            case LANGUAGE_HTML:
            case LANGUAGE_JSON:
            case LANGUAGE_LESS:
            case LANGUAGE_TEXT: {
                const handler = this.changeHandlers[filename];
                editor.getSession().off('change', handler);
                this.deleteChangeHandler(filename);
                break;
            }
            case LANGUAGE_MARKDOWN: {
                this.removeReadmeChangeHandler(filename, editor);
                break;
            }
            default: {
                console.warn(`detachEditor(mode => ${mode}) is being ignored.`);
            }
        }
        delete this.editors[filename];
    }

    /**
     * Update the scripts that the workspace uses to type-check the code.
     * This involves comparing the dependencies of the doodle to the
     * units that are already loaded. We compute those that must be added
     * and those that must be removed from the workspace in order to minimize
     * network traffic and to ensure that the doodle defines the correct dependencies.
     */
    updateWorkspace() {
        // Load the wokspace with the appropriate TypeScript definitions.
        const news: string[] = optionsToNames(closure(namesToOptions(this.doodles.current().dependencies, this.options), this.options));

        // Determine what we need to add and remove from the workspace.
        //
        // We must add what we need if it doesn't already exist in the workspace.
        // We must remove those things in the workspace that are no longer needed.
        /**
         * The things that we need to add to the workspace.
         */
        const adds: string[] = news.filter((dep) => { return this.olds.indexOf(dep) < 0; });
        /**
         * The things that we need to remove from the workspace.
         */
        const rmvs: string[] = this.olds.filter(function(dep) { return news.indexOf(dep) < 0; });

        // The following is not essential, as `lib` is not an option, it's always there.
        // TODO: This code is currently not being exercised because dependency changes cause a page reload.
        // In future, dependency changes will not cause a page reload.
        if (rmvs.indexOf('lib') >= 0) {
            // By removing it from the list, we will keep the 'lib' in the workspace and save an unload/load cycle.
            rmvs.splice(rmvs.indexOf('lib'), 1);
        }

        const rmvOpts: IOption[] = namesToOptions(rmvs, this.options);

        const rmvUnits: { name: string; fileName: string }[] = rmvOpts.map(function(option) { return { name: option.name, fileName: option.dts }; });

        const addOpts: IOption[] = namesToOptions(adds, this.options);

        // TODO: Optimize so that we don't keep loading `lib`.
        let addUnits: { name: string; fileName: string }[] = addOpts.map(function(option) { return { name: option.name, fileName: option.dts }; });

        // Ensure that the TypeScript ambient type definitions are present.
        if (this.olds.indexOf('lib') < 0) {
            addUnits = addUnits.concat({ name: 'lib', fileName: this.FILENAME_TYPESCRIPT_CURRENT_LIB_DTS });
        }

        /**
         * The domain on which we are running. e.g., `https://www.stemcstudio.com` or `localhost:8080`.
         * We determine this dynamically in order to access files in known locations on our server.
         * Current usage is for JavaScript files, TypeScript d.ts files, and paths to gists.
         * TODO: JavaScript and TypeScript to come from external repos.
         */
        const FWD_SLASH = '/';
        const DOMAIN = this.$location.protocol() + ':' + FWD_SLASH + FWD_SLASH + this.$location.host() + ":" + this.$location.port();

        const readFile = (fileName: string, callback: (err, data?) => void) => {
            const url = scriptURL(DOMAIN, fileName, this.VENDOR_FOLDER_MARKER);
            this.$http.get(url)
                .success(function(data, status: number, headers, config) {
                    callback(null, data);
                })
                .error(function(data, status: number, headers, config) {
                    callback(new Error("Unable to wrangle #{fileName}."));
                });
        };

        rmvUnits.forEach((rmvUnit) => {
            this.workspace.removeScript(rmvUnit.fileName);
            this.olds.splice(this.olds.indexOf(rmvUnit.name), 1);
        });

        addUnits.forEach((addUnit) => {
            readFile(addUnit.fileName, (err, content) => {
                if (!err) {
                    this.workspace.ensureScript(addUnit.fileName, content.replace(/\r\n?/g, '\n'));
                    this.olds.unshift(addUnit.name);
                }
            });
        });
    }

    rebuildPreview() {
        /**
         * The domain on which we are running. e.g., `https://www.stemcstudio.com` or `localhost:8080`.
         * We determine this dynamically in order to access files in known locations on our server.
         * Current usage is for JavaScript files, TypeScript d.ts files, and paths to gists.
         * TODO: JavaScript and TypeScript to come from external repos.
         */
        const FWD_SLASH = '/';
        const DOMAIN = this.$location.protocol() + ':' + FWD_SLASH + FWD_SLASH + this.$location.host() + ":" + this.$location.port();
        try {
            // Kill any existing frames.
            this.$scope.previewIFrame = undefined;
            const elementId = 'output';
            const preview = this.$window.document.getElementById(elementId);
            if (preview) {
                while (preview.children.length > 0) {
                    preview.removeChild(preview.firstChild);
                }
                const doodle: Doodle = this.doodles.current();
                if (doodle) {
                    const bestFile: string = doodle.getPreviewFileOrBestAvailable();
                    if (bestFile && this.$scope.isViewVisible) {

                        this.$scope.previewIFrame = document.createElement('iframe');
                        // Let's not change any more styles than we have to. 
                        this.$scope.previewIFrame.style.width = '100%';
                        this.$scope.previewIFrame.style.height = '100%';
                        this.$scope.previewIFrame.style.border = '0';
                        this.$scope.previewIFrame.style.backgroundColor = '#ffffff';

                        preview.appendChild(this.$scope.previewIFrame);

                        const content: Document = this.$scope.previewIFrame.contentDocument || this.$scope.previewIFrame.contentWindow.document;

                        let html: string = fileContent(bestFile, doodle);
                        if (isString(html)) {

                            const selOpts: IOption[] = this.options.filter((option: IOption, index: number, array: IOption[]) => {
                                return doodle.dependencies.indexOf(option.name) > -1;
                            });

                            const closureOpts: IOption[] = closure(selOpts, this.options);

                            const chosenCssFileNames: string[] = closureOpts.map(function(option: IOption) { return option.css; }).reduce(function(previousValue, currentValue) { return previousValue.concat(currentValue); }, []);
                            const stylesTags = chosenCssFileNames.map((fileName: string) => {
                                return "<link rel='stylesheet' href='" + scriptURL(DOMAIN, fileName, this.VENDOR_FOLDER_MARKER) + "'></link>\n";
                            });
                            html = html.replace(this.STYLES_MARKER, stylesTags.join(""));

                            const chosenJsFileNames: string[] = closureOpts.map(function(option: IOption) { return option.minJs; }).reduce(function(previousValue, currentValue) { return previousValue.concat(currentValue); }, []);
                            // TODO: We will later want to make operator overloading configurable for speed.

                            const scriptFileNames: string[] = this.doodles.current().operatorOverloading ? chosenJsFileNames.concat(this.FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS) : chosenJsFileNames;
                            // TOOD: Don't fix the location of the JavaScript here.
                            const scriptTags = scriptFileNames.map((fileName: string) => {
                                return "<script src='" + scriptURL(DOMAIN, fileName, this.VENDOR_FOLDER_MARKER) + "'></script>\n";
                            });

                            html = html.replace(this.SCRIPTS_MARKER, scriptTags.join(""));

                            // TODO: It would be nice to have a more flexible way to define stylesheet imports.
                            // TODO: We should then be able to move away from symbolic constants for the stylesheet file name.
                            if (fileExists('style.css', doodle)) {
                                html = html.replace(this.STYLE_MARKER, [fileContent('style.css', doodle)].join(""));
                            }
                            else if (fileExists(this.FILENAME_LESS, doodle)) {
                                html = html.replace(this.STYLE_MARKER, [fileContent(this.FILENAME_LESS, doodle)].join(""));
                            }

                            if (detect1x(doodle)) {
                                // This code is for backwards compatibility only, now that we support ES6 modules.
                                console.warn("Support for programs not using ES6 modules is deprecated. Please convert your program to use ES6 module loading.");
                                html = html.replace(this.LIBS_MARKER, currentJavaScript(this.FILENAME_LIBS, doodle));
                                html = html.replace(this.CODE_MARKER, currentJavaScript(this.FILENAME_CODE, doodle));
                                // For backwards compatibility (less than 1.x) ...
                                html = html.replace('<!-- STYLE-MARKER -->', ['<style>', fileContent(this.FILENAME_LESS, doodle), '</style>'].join(""));
                                html = html.replace('<!-- CODE-MARKER -->', currentJavaScript(this.FILENAME_CODE, this.doodles.current()));
                            }
                            else {
                                const modulesJs: string[] = [];
                                const names: string[] = Object.keys(doodle.lastKnownJs);
                                const iLen: number = names.length;
                                for (let i = 0; i < iLen; i++) {
                                    const name = names[i];
                                    const moduleJs = doodle.lastKnownJs[name];
                                    const moduleMs = doodle.operatorOverloading ? mathscript.transpile(moduleJs) : moduleJs;
                                    modulesJs.push(moduleMs);
                                }
                                html = html.replace(this.CODE_MARKER, modulesJs.join('\n'));
                            }

                            content.open();
                            content.write(html);
                            content.close();

                            bubbleIframeMouseMove(this.$scope.previewIFrame);
                        }
                        else {
                            console.warn(`bestFile => ${bestFile}`);
                        }
                    }
                }
            }
            else {
                // This can happen if we use ng-if to kill the element entirely, which we do.
            }
        }
        catch (e) {
            console.warn(e);
        }
    }

    /**
     * 
     */
    rebuildReadmeView() {
        try {
            const elementId = 'readme';
            // Kill any existing frames.
            const hostElement: HTMLElement = this.$window.document.getElementById(elementId);
            if (hostElement) {
                while (hostElement.children.length > 0) {
                    hostElement.removeChild(hostElement.firstChild);
                }
                const doodle: Doodle = this.doodles.current();
                if (doodle && this.$scope.isReadMeVisible) {
                    const iframe: HTMLIFrameElement = document.createElement('iframe');
                    iframe.style.width = '100%';
                    iframe.style.height = '100%';
                    iframe.style.border = '0';
                    iframe.style.backgroundColor = '#ffffff';

                    hostElement.appendChild(iframe);

                    let html = readMeHTML({});

                    const content = iframe.contentDocument || iframe.contentWindow.document;
                    if (fileExists(this.FILENAME_README, doodle)) {
                        const markdown: string = fileContent(this.FILENAME_README, doodle);
                        const converter: sd.Converter = new sd.Converter();
                        const markdownHTML = converter.makeHtml(markdown);
                        html = html.replace('// README.md', markdownHTML);
                    }
                    if (fileExists('README.css', doodle)) {
                        html = html.replace(`${FSLASH_STAR} README.css ${STAR_FSLASH}`, fileContent('README.css', doodle));
                    }

                    content.open();
                    content.write(html);
                    content.close();

                    bubbleIframeMouseMove(iframe);
                }
            }
            else {
                // This can happen if we use ng-if to kill the element entirely, which we do.
                // console.warn(`There is no element with id '${elementId}'.`)
            }
        }
        catch (e) {
            console.warn(e);
        }
    }
}
