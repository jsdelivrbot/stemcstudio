import * as ng from 'angular';
import CredentialsService from '../../services/credentials/CredentialsService';
import Delta from '../../editor/Delta';
import Document from '../../editor/Document';
import DocumentChangeHandler from './DocumentChangeHandler';
import Editor from '../../editor/Editor';
import EditSession from '../../editor/EditSession';
import EditSessionChangeHandler from './EditSessionChangeHandler';
import OutputFile from '../../editor/workspace/OutputFile';
import Background from '../../services/background/BackgroundService';
import { BACKGROUND_UUID } from '../../services/background/Background';
import CloudService from '../../services/cloud/CloudService';
import detect1x from './detect1x';
import Doodle from '../../services/doodles/Doodle';
import GitHubService from '../../services/github/GitHubService';
import LabelDialog from '../../modules/publish/LabelDialog';
import LabelFlow from './LabelFlow';
import PropertiesDialog from '../../modules/properties/PropertiesDialog';
import PropertiesFlow from './PropertiesFlow';
import PublishFlow from './PublishFlow';
import IGitHubAuthManager from '../../services/gham/IGitHubAuthManager';
import { GITHUB_AUTH_MANAGER } from '../../services/gham/IGitHubAuthManager';
import IOptionManager from '../../services/options/IOptionManager';
import isHtmlFilePath from '../../utils/isHtmlFilePath';
import isMarkdownFilePath from '../../utils/isMarkdownFilePath';
import OutputFileHandler from './OutputFileHandler';
import ModalDialog from '../../services/modalService/ModalDialog';
import NavigationService from '../../modules/navigation/NavigationService';
import { STATE_GIST } from '../../modules/navigation/NavigationService';
import { STATE_REPO } from '../../modules/navigation/NavigationService';
import { STATE_ROOM } from '../../modules/navigation/NavigationService';
import StemcArXiv from '../../stemcArXiv/StemcArXiv';
import FlowService from '../../services/flow/FlowService';
import UploadFlow from './UploadFlow';
import WorkspaceScope from '../../scopes/WorkspaceScope';
import WorkspaceMixin from '../editor/WorkspaceMixin';
import WsFile from '../../wsmodel/services/WsFile';
import WsModel from '../../wsmodel/services/WsModel';
import { LANGUAGE_CSS } from '../../languages/modes';
import { LANGUAGE_CSV } from '../../languages/modes';
import { LANGUAGE_GLSL } from '../../languages/modes';
import { LANGUAGE_HASKELL } from '../../languages/modes';
import { LANGUAGE_HTML } from '../../languages/modes';
import { LANGUAGE_JSON } from '../../languages/modes';
import { LANGUAGE_JAVA_SCRIPT } from '../../languages/modes';
import { LANGUAGE_LESS } from '../../languages/modes';
import { LANGUAGE_MARKDOWN } from '../../languages/modes';
import { LANGUAGE_PYTHON } from '../../languages/modes';
import { LANGUAGE_SCHEME } from '../../languages/modes';
import { LANGUAGE_TYPE_SCRIPT } from '../../languages/modes';
import { LANGUAGE_TEXT } from '../../languages/modes';
import { LANGUAGE_XML } from '../../languages/modes';
import updateWorkspaceTypings from './updateWorkspaceTypings';
import rebuildPreview from './rebuildPreview';
import rebuildMarkdownView from './rebuildMarkdownView';

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
const SCRIPT_TARGET = SCRIPT_TARGET_ES5;

/**
 *
 */
export default class WorkspaceController implements WorkspaceMixin {

    /**
     * Keep track of the dependencies that are loaded in the workspace.
     */
    private readonly olds: string[] = [];

    private outputFilesWatchRemover: () => void;
    private readonly previewChangeHandlers: { [path: string]: EditSessionChangeHandler } = {};

    /**
     * Promise to update the README view for throttling.
     */
    private readmePromise: angular.IPromise<void>;
    /**
     * Keep track of the README handlers that are registered for cleanup.
     */
    private readonly markdownChangeHandlers: { [path: string]: DocumentChangeHandler } = {};

    private resizeListener: (unused: UIEvent) => any;

    /**
     * Keep track of watches so that we can clean them up.
     */
    private readonly watches: (() => any)[] = [];

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
        'credentials',
        BACKGROUND_UUID,
        'GitHub',
        GITHUB_AUTH_MANAGER,
        'cloud',
        'templates',
        'flow',
        'ga',
        'labelDialog',
        'modalDialog',
        'navigation',
        'options',
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
        'wsModel'
    ];

    /**
     *
     */
    constructor(
        private $scope: WorkspaceScope,
        private $state: angular.ui.IStateService,
        private $stateParams: angular.ui.IStateParamsService,
        private $http: angular.IHttpService,
        private $location: angular.ILocationService,
        private $timeout: angular.ITimeoutService,
        private $window: angular.IWindowService,
        private credentials: CredentialsService,
        private background: Background,
        private github: GitHubService,
        authManager: IGitHubAuthManager,
        private cloud: CloudService,
        templates: Doodle[],
        private flowService: FlowService,
        ga: UniversalAnalytics.ga,
        private labelDialog: LabelDialog,
        private modalDialog: ModalDialog,
        private navigation: NavigationService,
        private options: IOptionManager,
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

        let rebuildPromise: angular.IPromise<void>;
        $scope.updatePreview = (delay: number) => {
            if (rebuildPromise) { $timeout.cancel(rebuildPromise); }
            rebuildPromise = $timeout(() => {
                rebuildPreview(
                    this.wsModel,
                    this.options,
                    this.$scope,
                    this.$location,
                    this.$window,
                    this.FILENAME_CODE,
                    this.FILENAME_LESS,
                    this.FILENAME_LIBS,
                    this.FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS,
                    this.LIBS_MARKER,
                    this.STYLES_MARKER,
                    this.VENDOR_FOLDER_MARKER); rebuildPromise = undefined;
            }, delay);
        };

        $scope.workspace = wsModel;

        $scope.files = function () {
            const fs: { [path: string]: WsFile } = {};
            if (!wsModel.isZombie()) {
                const paths = wsModel.getFileDocumentPaths();
                for (let i = 0; i < paths.length; i++) {
                    const path = paths[i];
                    fs[path] = wsModel.getFileWeakRef(path);
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
                this.disableMarkdownDocumentChangeTracking(previousFilePath);

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

        $scope.toggleView = function (label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'toggleView', label, value);
            $scope.isViewVisible = !$scope.isViewVisible;
            $scope.updatePreview(WAIT_NO_MORE);
        };

        $scope.comments = [];

        $scope.toggleCommentsVisible = (label?: string, value?: number) => {
            ga('send', 'event', 'doodle', 'toggleCommentsVisible', label, value);
            $scope.isCommentsVisible = !$scope.isCommentsVisible;
            if ($scope.isCommentsVisible) {
                // Experimenting with making these mutually exclusive.
                $scope.isMarkdownVisible = false;
                if (wsModel.isZombie()) {
                    github.getGistComments(wsModel.gistId).then((httpResponse) => {
                        const comments = httpResponse.data;
                        $scope.comments = comments.map(function (comment) {
                            return { type: 'info', msg: comment.body };
                        });
                    }).catch((reason) => {
                        console.warn(`getGistComments(gistId='${wsModel.gistId}') failed: ${JSON.stringify(reason, null, 2)}`);
                    });
                }
            }
        };

        $scope.toggleMarkdownVisible = (label?: string, value?: number) => {
            ga('send', 'event', 'doodle', 'toggleMarkdownVisible', label, value);
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
            ga('send', 'event', 'doodle', 'label', label, value);
            const labelFlow = new LabelFlow(this.flowService, this.labelDialog, wsModel);
            labelFlow.execute();
        };

        $scope.doProperties = (label?: string, value?: number) => {
            if (wsModel.isZombie()) {
                return;
            }
            ga('send', 'event', 'doodle', 'properties', label, value);
            const propertiesFlow = new PropertiesFlow(
                this.options,
                this.olds,
                this.FILENAME_TYPESCRIPT_CURRENT_LIB_DTS,
                this.$http,
                this.$location,
                this.VENDOR_FOLDER_MARKER,
                this.flowService,
                this.propertiesDialog,
                wsModel);

            propertiesFlow.execute((err) => {
                // 
                $scope.$applyAsync();
            });
        };

        $scope.doUpload = (label?: string, value?: number) => {
            if (wsModel.isZombie()) {
                return;
            }
            ga('send', 'event', 'doodle', 'upload', label, value);
            const uploadFlow = new UploadFlow(
                $scope.userLogin(),
                this.flowService,
                this.modalDialog,
                this.navigation,
                this.cloud,
                this.github,
                wsModel);
            uploadFlow.execute();
        };

        $scope.doPublish = (label?: string, value?: number) => {
            if (wsModel.isZombie()) {
                return;
            }
            ga('send', 'event', 'doodle', 'publish', label, value);
            const publishFlow = new PublishFlow(
                $scope.userLogin(),
                this.flowService,
                this.modalDialog,
                this.credentials,
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

        // Example of how to enable tracing in the main and worker thread.
        // TODO: Will this do any good if we haven't recycled?
        this.wsModel.setTrace(this.trace, (err) => {
            // Do nothing.
        });

        this.wsModel.recycle((err) => {
            if (!err) {
                this.background.loadWsModel(owner, repo, gistId, roomId, (err: Error) => {
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
                            this.wsModel.setDefaultLibrary(defaultLibURL, (err) => {
                                if (!err) {
                                    this.afterWorkspaceLoaded();
                                }
                                else {
                                    this.modalDialog.alert({ title: "Default Library Error", message: `${err}` });
                                }
                            });
                        }
                    }
                    else {
                        this.modalDialog.alert({ title: "Load Workspace Error", message: `${err}` });
                    }
                });

                this.outputFilesWatchRemover = this.wsModel.watch('outputFiles', this.createOutputFilesEventHandler());
            }
            else {
                this.modalDialog.alert({ title: "Start Workspace Error", message: `${err}` });
            }
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
            watch();
            this.watches[w] = void 0;
        }

        if (this.outputFilesWatchRemover) {
            this.outputFilesWatchRemover();
            this.outputFilesWatchRemover = void 0;
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
        this.$scope.$on('angular-resizable.resizeStart', (event: ng.IAngularEvent, data: any) => {
            // Do nothing.
        });

        // Event generated by the grabbar while resize is happening.
        this.$scope.$on('angular-resizable.resizing', (event: ng.IAngularEvent, data: any) => {
            // Do nothing to make the sizing smoother.
            // The resize will happen at the end.
        });

        // Event generated by the grabbar when resize ends.
        this.$scope.$on('angular-resizable.resizeEnd', (event: ng.IAngularEvent, data: any) => {
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

        this.watches.push(this.$scope.$watch('isViewVisible', (newVal: boolean, oldVal: boolean, unused: angular.IScope) => {
            if (this.wsModel.isZombie()) {
                return;
            }
            this.wsModel.isViewVisible = this.$scope.isViewVisible;
        }));

        this.watches.push(this.$scope.$watch('isEditMode', (newVal: boolean, oldVal: boolean, unused: angular.IScope) => {
            if (this.wsModel.isZombie()) {
                return;
            }
            this.wsModel.isCodeVisible = this.$scope.isEditMode;
        }));

        this.watches.push(this.$scope.$watch('isMarkdownVisible', (isVisible: boolean, oldVal: boolean, unused: angular.IScope) => {
            if (this.wsModel.isZombie()) {
                return;
            }
            const markdownFilePath = this.wsModel.getMarkdownFileChoiceOrBestAvailable();
            if (this.wsModel.existsFile(markdownFilePath)) {
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
            this.options,
            this.olds,
            this.FILENAME_TYPESCRIPT_CURRENT_LIB_DTS,
            this.$http,
            this.$location,
            this.VENDOR_FOLDER_MARKER, () => {
                // Set the module kind for transpilation consistent with the version.
                const moduleKind = detect1x(this.wsModel) ? MODULE_KIND_NONE : MODULE_KIND_SYSTEM;
                this.wsModel.setModuleKind(moduleKind, (moduleKindError) => {
                    if (!moduleKindError) {
                        // Set the script target for transpilation consistent with the version.
                        const scriptTarget = detect1x(this.wsModel) ? SCRIPT_TARGET_ES5 : SCRIPT_TARGET;

                        this.wsModel.setScriptTarget(scriptTarget, (scriptTargetError) => {
                            if (!scriptTargetError) {
                                this.wsModel.semanticDiagnostics((diagnosticsError) => {
                                    if (!diagnosticsError) {
                                        this.$scope.$applyAsync();
                                    }
                                    else {
                                        console.warn(`semanticDiagnostics() failed ${diagnosticsError}`);
                                    }
                                });
                                this.wsModel.outputFiles();
                                this.$scope.workspaceLoaded = true;
                                this.$scope.updatePreview(WAIT_NO_MORE);
                            }
                            else {
                                console.warn(`setScriptTarget(${scriptTarget}) failed ${scriptTargetError}`);
                            }
                        });
                    }
                    else {
                        console.warn(`setModuleKind(${moduleKind}) failed ${moduleKindError}`);
                    }
                });
            });
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
                editor.resize(true);
            }
        }
    }

    /**
     * 
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
            case LANGUAGE_PYTHON:
            case LANGUAGE_TYPE_SCRIPT:
            case LANGUAGE_XML: {
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
                editor.getSession().on('change', this.createPreviewChangeHandler(path));
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

        return () => {
            this.detachEditor(path, mode, editor);
        };
    }

    /**
     * Creates the handler function used to respond to (transpiled) 'outputFiles' events from the editor.
     * The handler function is cached so that it can be removed when the editor is detached from the workspace.
     */
    private createOutputFilesEventHandler(): OutputFileHandler<WsModel> {
        const handler = (event: { data: OutputFile[] }, unused: WsModel) => {
            // It's OK to capture the current Doodle here, but not outside the handler!
            const outputFiles = event.data;
            outputFiles.forEach((outputFile: OutputFile) => {
                if (this.wsModel.isZombie()) {
                    return;
                }
                if (typeof this.wsModel.lastKnownJs !== 'object') {
                    this.wsModel.lastKnownJs = {};
                }
                // TODO: The output files could be both JavaScript and d.ts
                // We should be sure to only select the JavaScript file. 
                if (this.wsModel.lastKnownJs[outputFile.name] !== outputFile.text) {
                    this.wsModel.lastKnownJs[outputFile.name] = outputFile.text;
                    this.$scope.updatePreview(WAIT_FOR_MORE_CODE_KEYSTROKES);
                }
            });
        };
        return handler;
    }

    private createPreviewChangeHandler(path: string): EditSessionChangeHandler {
        const handler = (delta: Delta, session: EditSession) => {
            if (this.wsModel && !this.wsModel.isZombie()) {
                this.$scope.updatePreview(WAIT_FOR_MORE_OTHER_KEYSTROKES);
            }
        };
        this.previewChangeHandlers[path] = handler;
        return handler;
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
            ); this.readmePromise = undefined;
        }, delay);
    }

    private deletePreviewChangeHandler(path: string): void {
        delete this.previewChangeHandlers[path];
    }

    /**
     * Add a change listener on the Document corresponding to the specified markdown file path.
     * This method is idempotent and so is safe to call even if there is already an existing change handler.
     */
    private enableMarkdownDocumentChangeTracking(filePath: string): void {
        if (!this.markdownChangeHandlers[filePath]) {
            const file = this.wsModel.findFileByPath(filePath);
            try {
                const doc = file.getDocument();
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
            finally {
                file.release();
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
            try {
                const doc = file.getDocument();
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
            finally {
                file.release();
            }
        }
        else {
            // Ignore because the file is not being tracked.
        }
    }

    /**
     * 
     */
    detachEditor(path: string, mode: string, editor: Editor): void {
        if (this.wsModel.isZombie()) {
            return;
        }

        switch (mode) {
            case LANGUAGE_HASKELL:
            case LANGUAGE_JAVA_SCRIPT:
            case LANGUAGE_PYTHON:
            case LANGUAGE_TYPE_SCRIPT:
            case LANGUAGE_XML: {
                // Ignore
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
                const handler = this.previewChangeHandlers[path];
                editor.getSession().off('change', handler);
                this.deletePreviewChangeHandler(path);
                break;
            }
            case LANGUAGE_MARKDOWN: {
                break;
            }
            default: {
                console.warn(`detachEditor(mode => ${mode}) is being ignored.`);
            }
        }

        this.wsModel.detachEditor(path, editor);
    }
}
