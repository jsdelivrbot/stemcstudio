import { IAngularEvent, IHttpService, ILocationService, IPromise, IScope, ITimeoutService, IWindowService } from 'angular';
import { IStateParamsService, IStateService } from 'angular-ui-router';
import { CATEGORY_WORKSPACE } from '../../modules/navigation/NavigationService';
import { CREDENTIALS_SERVICE_UUID, ICredentialsService } from '../../services/credentials/ICredentialsService';
import Delta from '../../editor/Delta';
import Document from '../../editor/Document';
import DocumentChangeHandler from './DocumentChangeHandler';
import Editor from '../../editor/Editor';
import EditSession from '../../editor/EditSession';
import EditSessionChangeHandler from './EditSessionChangeHandler';
import OutputFile from '../../editor/workspace/OutputFile';
import { BACKGROUND_SERVICE_UUID, IBackgroundService } from '../../services/background/IBackgroundService';
import { ChangedLintingHandler, ChangedLintingMessage, changedLinting } from '../../modules/wsmodel/IWorkspaceModel';
import { ChangedOperatorOverloadingHandler, ChangedOperatorOverloadingMessage, changedOperatorOverloading } from '../../modules/wsmodel/IWorkspaceModel';
import { CLOUD_SERVICE_UUID, ICloudService } from '../../services/cloud/ICloudService';
import detect1x from './detect1x';
import Doodle from '../../services/doodles/Doodle';
import { GITHUB_SERVICE_UUID, IGitHubService } from '../../services/github/IGitHubService';
import LabelDialog from '../../modules/publish/LabelDialog';
import LabelFlow from './LabelFlow';
import PropertiesDialog from '../../modules/properties/PropertiesDialog';
import PropertiesFlow from './PropertiesFlow';
import PublishFlow from './PublishFlow';
import { GITHUB_AUTH_MANAGER_UUID, IGitHubAuthManager } from '../../services/gham/IGitHubAuthManager';
import { OPTION_MANAGER_SERVICE_UUID, IOptionManager } from '../../services/options/IOptionManager';
import isHtmlFilePath from '../../utils/isHtmlFilePath';
import isMarkdownFilePath from '../../utils/isMarkdownFilePath';
import { OutputFilesMessage, outputFilesTopic } from '../../modules/wsmodel/IWorkspaceModel';
import OutputFileHandler from './OutputFileHandler';
import ModalDialog from '../../services/modalService/ModalDialog';
import { NAVIGATION_SERVICE_UUID, INavigationService } from '../../modules/navigation/INavigationService';
import RenamedFileHandler from './RenamedFileHandler';
import { RenamedFileMessage, renamedFileTopic } from '../../modules/wsmodel/IWorkspaceModel';
import { STATE_GIST } from '../../modules/navigation/NavigationService';
import { STATE_REPO } from '../../modules/navigation/NavigationService';
import { STATE_ROOM } from '../../modules/navigation/NavigationService';
import StemcArXiv from '../../modules/stemcArXiv/StemcArXiv';
import FlowService from '../../services/flow/FlowService';
import UploadFlow from './UploadFlow';
import WorkspaceScope from '../../scopes/WorkspaceScope';
import { WorkspaceEditorHost } from '../editor/WorkspaceEditorHost';
import FormatCodeSettings from '../../editor/workspace/FormatCodeSettings';
import TextChange from '../../editor/workspace/TextChange';
import { ITranslateService, TRANSLATE_SERVICE_UUID } from '../../modules/translate/api';
import WsFile from '../../modules/wsmodel/WsFile';
import WsModel from '../../modules/wsmodel/WsModel';
import { LANGUAGE_CSS } from '../../languages/modes';
import { LANGUAGE_CSV } from '../../languages/modes';
import { LANGUAGE_GLSL } from '../../languages/modes';
import { LANGUAGE_HASKELL } from '../../languages/modes';
import { LANGUAGE_HTML } from '../../languages/modes';
import { LANGUAGE_JSON } from '../../languages/modes';
import { LANGUAGE_JAVA_SCRIPT } from '../../languages/modes';
import { LANGUAGE_JSX } from '../../languages/modes';
import { LANGUAGE_LESS } from '../../languages/modes';
import { LANGUAGE_MARKDOWN } from '../../languages/modes';
import { LANGUAGE_PYTHON } from '../../languages/modes';
import { LANGUAGE_SCHEME } from '../../languages/modes';
import { LANGUAGE_TEXT } from '../../languages/modes';
import { LANGUAGE_TYPE_SCRIPT } from '../../languages/modes';
import { LANGUAGE_TSX } from '../../languages/modes';
import { LANGUAGE_XML } from '../../languages/modes';
import { LANGUAGE_YAML } from '../../languages/modes';
import updateWorkspaceTypings from './updateWorkspaceTypings';
import rebuildPreview from './rebuildPreview';
import rebuildMarkdownView from './rebuildMarkdownView';
import { WORKSPACE_MODEL_UUID } from '../../modules/wsmodel/IWorkspaceModel';

//
// RxJS
//
import { Subscription } from 'rxjs/Subscription';

/**
 * A delay of 0 (zero) second.
 */
const WAIT_NO_MORE = 0;

/**
 * A delay of 1.5 second.
 */
const WAIT_FOR_MORE_CODE_KEYSTROKES = 1500;

/**
 * A delay of 0.35 second.
 */
const WAIT_FOR_MORE_OTHER_KEYSTROKES = 350;

/**
 * A delay of 1 second.
 */
const WAIT_FOR_MORE_README_KEYSTROKES = 1000;

const MODULE_KIND_NONE = 'none';
const MODULE_KIND_SYSTEM = 'system';
const SCRIPT_TARGET_ES5 = 'es5';
// Upgrading to later versions of ECMAScript requires upgrading davinci-mathscript.
// const SCRIPT_TARGET_LATEST = 'latest';
const SCRIPT_TARGET = SCRIPT_TARGET_ES5;

function endsWith(str: string, suffix: string): boolean {
    const expectedPos = str.length - suffix.length;
    return expectedPos >= 0 && str.indexOf(suffix, expectedPos) === expectedPos;
}

function fileExtensionIs(path: string, extension: string): boolean {
    return path.length > extension.length && endsWith(path, extension);
}

/**
 *
 */
export default class WorkspaceController implements WorkspaceEditorHost {

    /**
     * Keep track of the dependencies that are loaded in the workspace.
     */
    private readonly olds: string[] = [];

    private outputFilesWatchRemover: (() => void) | undefined;
    private renamedFileWatchRemover: (() => void) | undefined;

    /**
     * A subscription to compiler settings events that have already been recorded by the Language Service.
     */
    private changedCompilerSettingsSubscription: Subscription | undefined;

    private changedLintingRemover: (() => void) | undefined;

    private changedOperatorOverloadingRemover: (() => void) | undefined;
    private readonly liveCodeChangeHandlers: { [path: string]: EditSessionChangeHandler } = {};

    /**
     * Promise to update the README view for throttling.
     */
    private readmePromise: IPromise<void> | undefined;
    /**
     * Keep track of the README handlers that are registered for cleanup.
     */
    private readonly markdownChangeHandlers: { [path: string]: DocumentChangeHandler } = {};

    private resizeListener: ((unused: UIEvent) => any) | undefined;

    /**
     * Keep track of watches so that we can clean them up.
     */
    private readonly watches: ((() => any) | undefined)[] = [];

    /**
     * Convenient flag used for debugging.
     * Normally set to false for production.
     */
    private readonly trace = false;
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
        CREDENTIALS_SERVICE_UUID,
        BACKGROUND_SERVICE_UUID,
        GITHUB_SERVICE_UUID,
        GITHUB_AUTH_MANAGER_UUID,
        CLOUD_SERVICE_UUID,
        'templates',
        TRANSLATE_SERVICE_UUID,
        'flow',
        'ga',
        'labelDialog',
        'modalDialog',
        NAVIGATION_SERVICE_UUID,
        OPTION_MANAGER_SERVICE_UUID,
        'propertiesDialog',
        'stemcArXiv',
        'FEATURE_GIST_ENABLED',
        'FEATURE_REPO_ENABLED',
        'FEATURE_ROOM_ENABLED',
        'FILENAME_CODE',
        'FILENAME_LIBS',
        'FILENAME_LESS',
        'FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS',
        'FILENAME_TYPESCRIPT_CURRENT_LIB_DTS',
        'STYLES_MARKER',
        'LIBS_MARKER',
        'VENDOR_FOLDER_MARKER',
        WORKSPACE_MODEL_UUID
    ];

    /**
     *
     */
    constructor(
        private $scope: WorkspaceScope,
        private $state: IStateService,
        private $stateParams: IStateParamsService,
        private $http: IHttpService,
        private $location: ILocationService,
        private $timeout: ITimeoutService,
        private $window: IWindowService,
        private credentialsService: ICredentialsService,
        private backgroundService: IBackgroundService,
        private githubService: IGitHubService,
        authManager: IGitHubAuthManager,
        private cloudService: ICloudService,
        templates: Doodle[],
        translateService: ITranslateService,
        private flowService: FlowService,
        ga: UniversalAnalytics.ga,
        private labelDialog: LabelDialog,
        private modalDialog: ModalDialog,
        private navigation: INavigationService,
        private optionManager: IOptionManager,
        private propertiesDialog: PropertiesDialog,
        private stemcArXiv: StemcArXiv,
        private FEATURE_GIST_ENABLED: boolean,
        private FEATURE_REPO_ENABLED: boolean,
        private FEATURE_ROOM_ENABLED: boolean,
        private FILENAME_CODE: string,
        private FILENAME_LIBS: string,
        private FILENAME_LESS: string,
        private FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS: string,
        private FILENAME_TYPESCRIPT_CURRENT_LIB_DTS: string,
        private STYLES_MARKER: string,
        private LIBS_MARKER: string,
        private VENDOR_FOLDER_MARKER: string,
        private wsModel: WsModel) {

        // const startTime = performance.now();
        $scope.FEATURE_ROOM_ENABLED = FEATURE_ROOM_ENABLED;

        let rebuildPromise: IPromise<void> | undefined;
        $scope.updatePreview = (delay: number) => {
            if (rebuildPromise) { $timeout.cancel(rebuildPromise); }
            rebuildPromise = $timeout(() => {
                rebuildPreview(
                    this.wsModel,
                    this.optionManager,
                    this.$scope,
                    this.$location,
                    this.$window,
                    this.FILENAME_CODE,
                    this.FILENAME_LESS,
                    this.FILENAME_LIBS,
                    this.FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS,
                    this.LIBS_MARKER,
                    this.STYLES_MARKER,
                    this.VENDOR_FOLDER_MARKER);
                rebuildPromise = undefined;
            }, delay);
        };

        $scope.workspace = wsModel;

        $scope.files = function () {
            const fs: { [path: string]: WsFile } = {};
            if (!wsModel.isZombie()) {
                const paths = wsModel.getFileDocumentPaths();
                for (const path of paths) {
                    const file = wsModel.getFileWeakRef(path);
                    if (file) {
                        fs[path] = file;
                    }
                }
            }
            return fs;
        };

        $scope.htmlFileCount = function () {
            if (wsModel && !wsModel.isZombie()) {
                const paths = wsModel.getFileDocumentPaths();
                return paths.filter(function (path) { return isHtmlFilePath(path); }).length;
            }
            else {
                return 0;
            }
        };

        $scope.markdownFileCount = function () {
            if (wsModel && !wsModel.isZombie()) {
                const paths = wsModel.getFileDocumentPaths();
                return paths.filter(function (path) { return isMarkdownFilePath(path); }).length;
            }
            else {
                return 0;
            }
        };

        $scope.doChooseHtml = (path: string): void => {
            if (!wsModel.isZombie()) {
                const file = wsModel.getFileWeakRef(path);
                if (file) {
                    wsModel.setHtmlFileChoice(path);
                    // The user probably wants to see the view, so make sure the view is visible.
                    $scope.isViewVisible = true;
                    $scope.updatePreview(WAIT_NO_MORE);
                }
            }
        };

        $scope.doChooseMarkdown = (chosenFilePath: string): void => {
            if (!wsModel.isZombie()) {

                const previousFilePath = wsModel.getHtmlFileChoiceOrBestAvailable();
                if (previousFilePath) {
                    this.disableMarkdownDocumentChangeTracking(previousFilePath);
                }

                const chosenFile = wsModel.getFileWeakRef(chosenFilePath);
                if (chosenFile) {
                    wsModel.setMarkdownFileChoice(chosenFilePath);
                    this.enableMarkdownDocumentChangeTracking(chosenFilePath);
                    // The user probably wants to see the markdown output, so make sure the markdown output is visible.
                    $scope.isMarkdownVisible = true;
                    this.updateMarkdownView(WAIT_NO_MORE);
                }
            }
        };

        $scope.toggleMode = function (label?: string, value?: number) {
            // Is this dead code?
            ga('send', 'event', CATEGORY_WORKSPACE, 'toggleMode', label, value);
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

        $scope.toggleView = function (label?: string, value?: number) {
            ga('send', 'event', CATEGORY_WORKSPACE, 'toggleView', label, value);
            $scope.isViewVisible = !$scope.isViewVisible;
            $scope.updatePreview(WAIT_NO_MORE);
        };

        $scope.comments = [];

        $scope.toggleCommentsVisible = (label?: string, value?: number) => {
            ga('send', 'event', CATEGORY_WORKSPACE, 'toggleCommentsVisible', label, value);
            $scope.isCommentsVisible = !$scope.isCommentsVisible;
            if ($scope.isCommentsVisible) {
                // Experimenting with making these mutually exclusive.
                $scope.isMarkdownVisible = false;
                if (wsModel.isZombie()) {
                    githubService.getGistComments(wsModel.gistId as string)
                        .then((httpResponse) => {
                            const comments = httpResponse.data;
                            if (Array.isArray(comments)) {
                                $scope.comments = comments.map(function (comment) {
                                    return { type: 'info', msg: comment.body };
                                });
                            }
                        })
                        .catch((reason) => {
                            console.warn(`getGistComments(gistId='${wsModel.gistId}') failed: ${JSON.stringify(reason, null, 2)}`);
                        });
                }
            }
        };

        $scope.toggleMarkdownVisible = (label?: string, value?: number) => {
            ga('send', 'event', CATEGORY_WORKSPACE, 'toggleMarkdownVisible', label, value);
            $scope.isMarkdownVisible = !$scope.isMarkdownVisible;
            if ($scope.isMarkdownVisible) {
                $scope.isCommentsVisible = false;
            }
            this.updateMarkdownView(WAIT_NO_MORE);
        };

        $scope.doLabel = (label?: string, value?: number) => {
            if (wsModel.isZombie()) {
                return;
            }
            ga('send', 'event', CATEGORY_WORKSPACE, 'label', label, value);
            const labelFlow = new LabelFlow(this.flowService, this.labelDialog, wsModel);
            labelFlow.execute();
        };

        $scope.doProperties = (label?: string, value?: number) => {
            if (wsModel.isZombie()) {
                return;
            }
            ga('send', 'event', CATEGORY_WORKSPACE, 'properties', label, value);
            const propertiesFlow = new PropertiesFlow(
                this.optionManager,
                this.olds,
                this.FILENAME_TYPESCRIPT_CURRENT_LIB_DTS,
                this.$http,
                this.$location,
                this.VENDOR_FOLDER_MARKER,
                this.flowService,
                this.propertiesDialog,
                wsModel);

            propertiesFlow.execute((reason) => {
                if (!reason) {
                    $scope.$applyAsync();
                }
                else {
                    // Most likely the user cancelled, but we could be more precise.
                    // console.warn(`propertiesFlow() failed '${reason}'`);
                }
            });
        };

        $scope.doUpload = (label?: string, value?: number) => {
            if (wsModel.isZombie()) {
                return;
            }
            ga('send', 'event', CATEGORY_WORKSPACE, 'upload', label, value);
            const owner = $scope.userLogin();
            const uploadFlow = new UploadFlow(
                owner,
                this.flowService,
                this.modalDialog,
                this.navigation,
                this.cloudService,
                this.githubService,
                wsModel);
            uploadFlow.execute();
        };

        $scope.doPublish = (label?: string, value?: number) => {
            if (wsModel.isZombie()) {
                return;
            }
            ga('send', 'event', CATEGORY_WORKSPACE, 'publish', label, value);
            const owner = $scope.userLogin();
            const publishFlow = new PublishFlow(
                owner,
                this.flowService,
                this.modalDialog,
                this.credentialsService,
                this.stemcArXiv,
                wsModel);
            publishFlow.execute();
        };
    }

    /**
     * This lifecycle hook will be executed when all controllers on an element have been constructed,
     * and after their bindings are initialized. This hook is meant to be used for any kind of
     * initialization work of a controller.
     */
    $onInit(): void {

        const owner: string = this.$stateParams['owner'];
        const repo: string = this.$stateParams['repo'];
        const gistId: string = this.$stateParams['gistId'];
        const roomId: string = this.$stateParams['roomId'];

        // This flag prevents the editors from being being...?
        this.$scope.doodleLoaded = false;

        this.wsModel.recycle()
            .then(() => {
                return this.wsModel.setTrace(this.trace);
            })
            .then(() => {
                this.backgroundService.loadWsModel(owner, repo, gistId, roomId, (err: Error) => {
                    if (!err) {
                        // We don't need to load anything, but are we in the correct state for the Doodle?
                        // We end up here, e.g., when user presses Cancel from New dialog.
                        if (gistId && this.FEATURE_GIST_ENABLED && !this.$state.is(STATE_GIST, { gistId })) {
                            this.navigation.gotoGist(gistId);
                        }
                        else if (owner && repo && this.FEATURE_REPO_ENABLED && !this.$state.is(STATE_REPO, { owner, repo })) {
                            this.navigation.gotoRepo(owner, repo);
                        }
                        else if (roomId && this.FEATURE_ROOM_ENABLED && !this.$state.is(STATE_ROOM, { roomId })) {
                            this.navigation.gotoRoom(roomId);
                        }
                        else {
                            // We are in the correct state.
                            this.$scope.doodleLoaded = true;
                            const defaultLibURL = '/typings/lib.es6.d.ts';
                            this.wsModel.setDefaultLibrary(defaultLibURL)
                                .then(() => {
                                    this.afterWorkspaceLoaded();
                                })
                                .catch((err) => {
                                    this.modalDialog.alert({ title: "Default Library Error", message: `${err}` });
                                });
                        }
                    }
                    else {
                        this.modalDialog.alert({ title: "Load Workspace Error", message: `${err}` });
                    }
                });

                this.outputFilesWatchRemover = this.wsModel.watch(outputFilesTopic, this.createOutputFilesEventHandler());
                this.renamedFileWatchRemover = this.wsModel.watch(renamedFileTopic, this.createRenamedFileEventHandler());
                this.changedLintingRemover = this.wsModel.watch(changedLinting, this.createChangedLintingEventHandler());

                this.changedOperatorOverloadingRemover = this.wsModel.watch(changedOperatorOverloading, this.createChangedOperatorOverloadingEventHandler());


                this.changedCompilerSettingsSubscription = this.wsModel.changedCompilerSettings
                    .debounceTime(500)
                    .subscribe((settings) => {
                        this.compile();
                    }, (reason) => {
                        console.warn(`Unable to recompile following change in compiler settings. Cause: ${reason}`);
                    });

            })
            .catch((err) => {
                this.modalDialog.alert({ title: "Recycle Workspace Error", message: `${err}` });
            });
    }

    /**
     * This lifecycle hook that is called when its containing scope is destroyed.
     * We can use this hook to release external resources, watches and event handlers.
     */
    $onDestroy(): void {
        // Cancel all of the watches.
        for (let w = 0; w < this.watches.length; w++) {
            const watch = this.watches[w];
            if (watch) {
                watch();
                this.watches[w] = void 0;
            }
        }

        if (this.outputFilesWatchRemover) {
            this.outputFilesWatchRemover();
            this.outputFilesWatchRemover = void 0;
        }

        if (this.renamedFileWatchRemover) {
            this.renamedFileWatchRemover();
            this.renamedFileWatchRemover = void 0;
        }

        if (this.changedCompilerSettingsSubscription) {
            this.changedCompilerSettingsSubscription.unsubscribe();
            this.changedCompilerSettingsSubscription = void 0;
        }

        if (this.changedOperatorOverloadingRemover) {
            this.changedOperatorOverloadingRemover();
            this.changedOperatorOverloadingRemover = void 0;
        }

        if (this.resizeListener) {
            this.$window.removeEventListener('resize', this.resizeListener);
            this.resizeListener = void 0;
        }

        // This method is called BEFORE the child directives make their detachEditor calls!
        this.wsModel.dispose();
    }

    /**
     * 
     */
    private afterWorkspaceLoaded(): void {

        this.resizeListener = (unused: UIEvent) => {
            this.resize();
        };

        this.$window.addEventListener('resize', this.resizeListener);

        // Event generated by the grabbar when resize starts.
        this.$scope.$on('angular-resizable.resizeStart', (event: IAngularEvent, data: any) => {
            // Do nothing.
        });

        // Event generated by the grabbar while resize is happening.
        this.$scope.$on('angular-resizable.resizing', (event: IAngularEvent, data: any) => {
            // Do nothing to make the sizing smoother.
            // The resize will happen at the end.
        });

        // Event generated by the grabbar when resize ends.
        this.$scope.$on('angular-resizable.resizeEnd', (event: IAngularEvent, data: any) => {
            // Force the editors to resize after the grabbar has stopped so
            // that the editor knows where its boundaries are. If we don't do this,
            // placing the mouse cursor can cause the editor to jump because it thinks
            // the cursor is not visible.
            this.resize();
        });

        this.resize();

        // Following a browser refresh, show the code so that it refreshes correctly (bug).
        // This also side-steps the issue of the time it takes to restart the preview.
        // Ideally we remove this line and use the cached `lastKnownJs` to provide the preview.
        this.wsModel.isCodeVisible = true;

        // Bit of a smell here. Should we be updating the scope?
        this.$scope.isEditMode = this.wsModel.isCodeVisible;
        // Don't start in Playing mode in case the user has a looping program (give chance to fix the code).
        this.$scope.isViewVisible = false;
        // Don't display comments initially to keep things clean.
        this.$scope.isCommentsVisible = false;
        // No such issue with the README.md
        this.$scope.isMarkdownVisible = true;

        this.watches.push(this.$scope.$watch('isViewVisible', (newVal: boolean, oldVal: boolean, unused: IScope) => {
            if (this.wsModel.isZombie()) {
                return;
            }
            this.wsModel.isViewVisible = this.$scope.isViewVisible;
        }));

        this.watches.push(this.$scope.$watch('isEditMode', (newVal: boolean, oldVal: boolean, unused: IScope) => {
            if (this.wsModel.isZombie()) {
                return;
            }
            this.wsModel.isCodeVisible = this.$scope.isEditMode;
        }));

        this.watches.push(this.$scope.$watch('isMarkdownVisible', (isVisible: boolean, oldVal: boolean, unused: IScope) => {
            if (this.wsModel.isZombie()) {
                return;
            }
            const markdownFilePath = this.wsModel.getMarkdownFileChoiceOrBestAvailable();
            if (markdownFilePath && this.wsModel.existsFile(markdownFilePath)) {
                if (isVisible) {
                    this.enableMarkdownDocumentChangeTracking(markdownFilePath);
                    this.updateMarkdownView(WAIT_NO_MORE);
                }
                else {
                    this.disableMarkdownDocumentChangeTracking(markdownFilePath);
                }
            }
        }));

        updateWorkspaceTypings(
            this.wsModel,
            this.optionManager,
            this.olds,
            this.FILENAME_TYPESCRIPT_CURRENT_LIB_DTS,
            this.$http,
            this.$location,
            this.VENDOR_FOLDER_MARKER, () => {
                // Set the module kind for transpilation consistent with the version.
                // TODO: Clean this up
                const promises: Promise<any>[] = [];
                const moduleKind = detect1x(this.wsModel) ? MODULE_KIND_NONE : MODULE_KIND_SYSTEM;
                const scriptTarget = detect1x(this.wsModel) ? SCRIPT_TARGET_ES5 : SCRIPT_TARGET;
                // promises.push(this.wsModel.setTrace(false));
                promises.push(this.wsModel.synchOperatorOverloading());
                promises.push(this.wsModel.synchModuleKind(moduleKind));
                promises.push(this.wsModel.synchScriptTarget(scriptTarget));
                const tsconfig = this.wsModel.tsconfigSettings;
                if (tsconfig) {
                    promises.push(this.wsModel.synchTsConfig(tsconfig));
                }
                else {
                    console.warn("tsconfig will not be used");
                }
                Promise.all(promises)
                    .then(() => {
                        this.compile();
                        this.$scope.workspaceLoaded = true;
                        // The following line may be redundant because we handle the files elsewhare.
                        this.$scope.updatePreview(WAIT_NO_MORE);
                    })
                    .catch((reason) => {
                        console.warn(`setOperatorOverloading(${this.wsModel.operatorOverloading}) failed ${reason}`);
                        console.warn(`setModuleKind(${moduleKind}) failed ${reason}`);
                        console.warn(`setScriptTarget(${scriptTarget}) failed ${reason}`);
                    });
            });
    }

    /**
     * Refreshes the diagnostics and output files.
     */
    private compile(): void {
        this.wsModel.refreshDiagnostics((diagnosticsError) => {
            if (!diagnosticsError) {
                this.$scope.$applyAsync();
            }
            else {
                console.warn(`refreshDiagnostics() failed ${diagnosticsError}`);
            }
        });
        this.wsModel.outputFiles();
    }

    /**
     * Do what needs to be done when the window is resized.
     */
    private resize(): void {
        if (!this.wsModel.isZombie()) {
            const paths = this.wsModel.getFileEditorPaths();
            const iLen = paths.length;
            for (let i = 0; i < iLen; i++) {
                const path = paths[i];
                const editor = this.wsModel.getFileEditor(path);
                if (editor) {
                    editor.resize(true);
                }
            }
        }
    }

    /**
     * Attaches the Editor to the workspace model, enabling the IDE features.
     * Connects a Preview change handler to all appropriate editors so for Live Coding.
     */
    attachEditor(path: string, mode: string, editor: Editor): () => void {
        // const startTime = performance.now();
        if (this.wsModel.isZombie()) {
            return () => {
                // Do nothing.
            };
        }
        this.wsModel.attachEditor(path, editor);

        switch (mode) {
            case LANGUAGE_HASKELL:
            case LANGUAGE_JAVA_SCRIPT:
            case LANGUAGE_JSX:
            case LANGUAGE_PYTHON:
            case LANGUAGE_TYPE_SCRIPT:
            case LANGUAGE_TSX:
            case LANGUAGE_XML:
            case LANGUAGE_YAML: {
                // Ignore.
                break;
            }
            case LANGUAGE_CSS:
            case LANGUAGE_CSV:
            case LANGUAGE_GLSL:
            case LANGUAGE_HTML:
            case LANGUAGE_JSON:
            case LANGUAGE_LESS:
            case LANGUAGE_SCHEME:
            case LANGUAGE_TEXT: {
                // This listener will be removed in the detachEditor method.
                editor.sessionOrThrow().on('change', this.createLiveCodeChangeHandler(path));
                break;
            }
            case LANGUAGE_MARKDOWN: {
                break;
            }
            default: {
                console.warn(`attachEditor(mode => ${mode}) is being ignored.`);
            }
        }

        // The editors are attached after $onInit and so we miss the initial resize.
        editor.resize(true);

        // Return a tear down function that detaches the editor.
        return () => {
            this.detachEditor(path, mode, editor);
        };
    }

    /**
     * Requests the formatting edit text changes for a document specified by its path.
     */
    requestFormattingEditsForDocument(path: string, settings: FormatCodeSettings): Promise<TextChange[]> {
        return new Promise<TextChange[]>((resolve, reject) => {
            function callback(err: any, textChanges: TextChange[]) {
                if (!err) {
                    resolve(textChanges);
                }
                else {
                    reject(err);
                }
            }
            // TODO: Promisify this function on the workspace model too.
            this.wsModel.getFormattingEditsForDocument(path, settings, callback);
        });
    }

    /**
     * Creates the handler function used to respond to (transpiled) output files events from the editor.
     * The handler function is cached so that it can be removed when the editor is detached from the workspace.
     */
    private createOutputFilesEventHandler(): OutputFileHandler<WsModel> {
        const handler = (message: OutputFilesMessage, unused: WsModel) => {
            const outputFiles = message.files;
            outputFiles.forEach((outputFile: OutputFile) => {
                if (this.wsModel.isZombie()) {
                    return;
                }
                const path = outputFile.name;
                if (fileExtensionIs(path, '.js')) {
                    if (typeof this.wsModel.lastKnownJs !== 'object') {
                        this.wsModel.lastKnownJs = {};
                    }
                    if (this.wsModel.lastKnownJs[path] !== outputFile.text) {
                        this.wsModel.lastKnownJs[path] = outputFile.text;
                        this.$scope.updatePreview(WAIT_FOR_MORE_CODE_KEYSTROKES);
                    }
                }
                else if (fileExtensionIs(path, '.js.map')) {
                    if (typeof this.wsModel.lastKnownJsMap !== 'object') {
                        this.wsModel.lastKnownJsMap = {};
                    }
                    if (this.wsModel.lastKnownJsMap[path] !== outputFile.text) {
                        this.wsModel.lastKnownJsMap[path] = outputFile.text;
                        this.$scope.updatePreview(WAIT_FOR_MORE_CODE_KEYSTROKES);
                    }
                }
                else {
                    console.warn(`Unexpected outputFile => ${outputFile.name}`);
                }
            });
        };
        return handler;
    }

    private createChangedLintingEventHandler(): ChangedLintingHandler<WsModel> {
        const handler = (message: ChangedLintingMessage, unused: WsModel) => {
            const { oldValue, newValue } = message;
            if (oldValue !== newValue) {
                this.compile();
            }
            else {
                // Not expecting to get an event when there is no difference.
                console.warn(`linting ${oldValue} => ${newValue}`);
            }
        };
        return handler;
    }

    /**
     * When the operator overloading value changes, we will generally want to refresh both
     * the diagnostic messages and the transpiled code.
     */
    private createChangedOperatorOverloadingEventHandler(): ChangedOperatorOverloadingHandler<WsModel> {
        const handler = (message: ChangedOperatorOverloadingMessage, unused: WsModel) => {
            const { oldValue, newValue } = message;
            if (oldValue !== newValue) {
                this.compile();
            }
            else {
                // Not expecting to get an event when there is no difference.
                console.warn(`operatorOverloading ${oldValue} => ${newValue}`);
            }
        };
        return handler;
    }

    private createRenamedFileEventHandler(): RenamedFileHandler<WsModel> {
        const handler = (message: RenamedFileMessage, unused: WsModel) => {
            // No action is required. We are expecting another event for the output files.
        };
        return handler;
    }

    /**
     * Creates a handler for prevew changes and caches it for later removal.
     */
    private createLiveCodeChangeHandler(path: string): EditSessionChangeHandler {
        const liveCodeChangeHandler = (delta: Delta, session: EditSession) => {
            if (this.wsModel && !this.wsModel.isZombie()) {
                this.$scope.updatePreview(WAIT_FOR_MORE_OTHER_KEYSTROKES);
            }
        };
        // Cache it for later removal.
        this.liveCodeChangeHandlers[path] = liveCodeChangeHandler;
        return liveCodeChangeHandler;
    }

    private createMarkdownChangeHandler(path: string): DocumentChangeHandler {
        const handler = (delta: Delta, source: Document) => {
            if (this.wsModel && !this.wsModel.isZombie()) {
                this.updateMarkdownView(WAIT_FOR_MORE_README_KEYSTROKES);
            }
        };
        this.markdownChangeHandlers[path] = handler;
        return handler;
    }

    private updateMarkdownView(delay: number) {
        // Throttle the requests to update the README view.
        if (this.readmePromise) { this.$timeout.cancel(this.readmePromise); }
        this.readmePromise = this.$timeout(() => {
            rebuildMarkdownView(
                this.wsModel,
                this.$scope,
                this.$window
            );
            this.readmePromise = undefined;
        }, delay);
    }

    /**
     * Add a change listener on the Document corresponding to the specified markdown file path.
     * This method is idempotent and so is safe to call even if there is already an existing change handler.
     */
    private enableMarkdownDocumentChangeTracking(filePath: string): void {
        if (!this.markdownChangeHandlers[filePath]) {
            const file = this.wsModel.findFileByPath(filePath);
            if (file) {
                try {
                    const doc = file.getDocument();
                    if (doc) {
                        try {
                            if (this.markdownChangeHandlers[filePath]) {
                                console.warn(`NOT Expecting to find a Markdown change handler for file ${filePath}.`);
                                return;
                            }
                            const handler = this.createMarkdownChangeHandler(filePath);
                            doc.addChangeListener(handler);
                            this.markdownChangeHandlers[filePath] = handler;
                            this.updateMarkdownView(WAIT_NO_MORE);
                        }
                        finally {
                            doc.release();
                        }
                    }
                }
                finally {
                    file.release();
                }
            }
        }
        else {
            // Ignore because the file is already being tracked.
        }
    }

    /**
     * Remove any change listener on the Document corresponding to the specified markdown file path.
     * This method is idempotent and so is safe to call even if there is no existing change handler.
     */
    private disableMarkdownDocumentChangeTracking(filePath: string): void {
        if (this.markdownChangeHandlers[filePath]) {
            const file = this.wsModel.findFileByPath(filePath);
            if (file) {
                try {
                    const doc = file.getDocument();
                    if (doc) {
                        try {
                            const handler = this.markdownChangeHandlers[filePath];
                            if (handler) {
                                doc.removeChangeListener(handler);
                                delete this.markdownChangeHandlers[filePath];
                            }
                            else {
                                console.warn(`Expecting to find a Markdown change handler for file ${filePath}.`);
                            }
                        }
                        finally {
                            doc.release();
                        }
                    }
                }
                finally {
                    file.release();
                }
            }
        }
        else {
            // Ignore because the file is not being tracked.
        }
    }

    /**
     * Removes the change handler responsible for Live Coding from the Editor.
     */
    private removeLiveCodeChangeHandler(path: string, mode: string, editor: Editor): void {
        switch (mode) {
            case LANGUAGE_HASKELL:
            case LANGUAGE_JAVA_SCRIPT:
            case LANGUAGE_JSX:
            case LANGUAGE_PYTHON:
            case LANGUAGE_TYPE_SCRIPT:
            case LANGUAGE_TSX:
            case LANGUAGE_XML:
            case LANGUAGE_YAML: {
                // Ignore.
                break;
            }
            case LANGUAGE_CSS:
            case LANGUAGE_CSV:
            case LANGUAGE_GLSL:
            case LANGUAGE_HTML:
            case LANGUAGE_JSON:
            case LANGUAGE_LESS:
            case LANGUAGE_SCHEME:
            case LANGUAGE_TEXT: {
                // TODO: It would be better to refactor this into a single method
                // that accesses the cache, removes the listener and clears the cache entry.
                const liveCodeChangeHandler = this.liveCodeChangeHandlers[path];
                if (liveCodeChangeHandler) {
                    // TODO: We could be more defensive here and check the session.
                    editor.sessionOrThrow().off('change', liveCodeChangeHandler);
                    delete this.liveCodeChangeHandlers[path];
                }
                else {
                    console.warn(`removeLiveCodeChangeHandler(path => ${path}, mode => ${mode}) is redundant.`);
                }
                break;
            }
            case LANGUAGE_MARKDOWN: {
                break;
            }
            default: {
                console.warn(`removeLiveCodeChangeHandler(path => ${path}, mode => ${mode}) is being ignored.`);
            }
        }
    }

    /**
     * 1. Removes the Live Code change handler from the Editor.
     * 2. Detaches the editor from the workspace model, disabling IDE features.
     */
    detachEditor(path: string, mode: string, editor: Editor): void {

        // Guard against race conditions.
        if (this.wsModel.isZombie()) {
            return;
        }

        this.removeLiveCodeChangeHandler(path, mode, editor);

        this.wsModel.detachEditor(path, editor);
    }
}
