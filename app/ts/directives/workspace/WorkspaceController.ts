import * as ng from 'angular';
import CredentialsService from '../../services/credentials/CredentialsService';
import Base64Service from '../../services/base64/Base64Service';
import Delta from '../../editor/Delta';
import Editor from '../../editor/Editor';
import EditSession from '../../editor/EditSession';
import OutputFile from '../../editor/workspace/OutputFile';
import Background from '../../services/background/BackgroundService';
import {BACKGROUND_UUID} from '../../services/background/Background';
import CloudService from '../../services/cloud/CloudService';
import detect1x from './detect1x';
import Doodle from '../../services/doodles/Doodle';
import IDoodleManager from '../../services/doodles/IDoodleManager';
import GitHubService from '../../services/github/GitHubService';
import LabelDialog from '../../modules/publish/LabelDialog';
import LabelFlow from './LabelFlow';
import PropertiesDialog from '../../modules/properties/PropertiesDialog';
import PropertiesFlow from './PropertiesFlow';
import PublishFlow from './PublishFlow';
import IGitHubAuthManager from '../../services/gham/IGitHubAuthManager';
import IOptionManager from '../../services/options/IOptionManager';
import isHtmlFilePath from '../../utils/isHtmlFilePath';
import isMarkdownFilePath from '../../utils/isMarkdownFilePath';
import ChangeHandler from './ChangeHandler';
import OutputFileHandler from './OutputFileHandler';
import MissionControl from '../../services/mission/MissionControl';
import ModalDialog from '../../services/modalService/ModalDialog';
import PublishDialog from '../../modules/publish/PublishDialog';
import StemcArXiv from '../../stemcArXiv/StemcArXiv';
import FlowService from '../../services/flow/FlowService';
import UploadFlow from './UploadFlow';
import WorkspaceScope from '../../scopes/WorkspaceScope';
import WorkspaceMixin from '../editor/WorkspaceMixin';
import WsFile from '../../wsmodel/services/WsFile';
import WsModel from '../../wsmodel/services/WsModel';
import {LANGUAGE_CSS} from '../../languages/modes';
import {LANGUAGE_HTML} from '../../languages/modes';
import {LANGUAGE_JSON} from '../../languages/modes';
import {LANGUAGE_JAVA_SCRIPT} from '../../languages/modes';
import {LANGUAGE_LESS} from '../../languages/modes';
import {LANGUAGE_MARKDOWN} from '../../languages/modes';
import {LANGUAGE_PYTHON} from '../../languages/modes';
import {LANGUAGE_TYPE_SCRIPT} from '../../languages/modes';
import {LANGUAGE_TEXT} from '../../languages/modes';
import updateWorkspaceTypings from './updateWorkspaceTypings';
import rebuildPreview from './rebuildPreview';
import rebuildReadmeView from './rebuildReadmeView';

// import BootstrapDialog from 'bootstrap-dialog';

const WAIT_NO_MORE = 0;
const WAIT_FOR_MORE_CODE_KEYSTROKES = 1500;
const WAIT_FOR_MORE_OTHER_KEYSTROKES = 350;
const WAIT_FOR_MORE_README_KEYSTROKES = 1000;
// const WAIT_FOR_STATE_CHANGES = 100;

const MODULE_KIND_NONE = 'none';
const MODULE_KIND_SYSTEM = 'system';
const SCRIPT_TARGET_ES5 = 'es5';

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
        'credentials',
        BACKGROUND_UUID,
        'base64',
        'GitHub',
        'GitHubAuthManager',
        'cloud',
        'doodles',
        'templates',
        'flow',
        'ga',
        'labelDialog',
        'missionControl',
        'modalDialog',
        'options',
        'propertiesDialog',
        'publishDialog',
        'stemcArXiv',
        'FEATURE_GIST_ENABLED',
        'FEATURE_REPO_ENABLED',
        'FEATURE_SYNC_ENABLED',
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
        'wsModel'
    ];

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
        private credentials: CredentialsService,
        private background: Background,
        private base64: Base64Service,
        private github: GitHubService,
        authManager: IGitHubAuthManager,
        private cloud: CloudService,
        private doodles: IDoodleManager,
        templates: Doodle[],
        private flowService: FlowService,
        ga: UniversalAnalytics.ga,
        private labelDialog: LabelDialog,
        private missionControl: MissionControl,
        private modalDialog: ModalDialog,
        private options: IOptionManager,
        private propertiesDialog: PropertiesDialog,
        private publishDialog: PublishDialog,
        private stemcArXiv: StemcArXiv,
        private FEATURE_GIST_ENABLED: boolean,
        private FEATURE_REPO_ENABLED: boolean,
        private FEATURE_SYNC_ENABLED: boolean,
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
        private wsModel: WsModel) {

        // const startTime = performance.now();
        $scope.FEATURE_SYNC_ENABLED = FEATURE_SYNC_ENABLED;

        let rebuildPromise: angular.IPromise<void>;
        $scope.updatePreview = (delay: number) => {
            if (rebuildPromise) { $timeout.cancel(rebuildPromise); }
            rebuildPromise = $timeout(() => { rebuildPreview(
                this.wsModel,
                this.options,
                this.$scope,
                this.$location,
                this.$window,
                this.CODE_MARKER,
                this.FILENAME_CODE,
                this.FILENAME_LESS,
                this.FILENAME_LIBS,
                this.FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS,
                this.LIBS_MARKER,
                this.SCRIPTS_MARKER,
                this.STYLE_MARKER,
                this.STYLES_MARKER,
                this.VENDOR_FOLDER_MARKER); rebuildPromise = undefined; }, delay);
        };

        $scope.workspace = wsModel;

        $scope.files = function() {
            const fs: {[path: string]: WsFile} = {};
            const paths = wsModel.files.keys;
            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                const file = wsModel.files.getWeakRef(path);
                fs[path] = file;
            }
            return fs;
        };

        $scope.htmlFileCount = function() {
            if (wsModel) {
                const files = wsModel.files;
                const paths = files.keys;
                return paths.filter(function(path) { return isHtmlFilePath(path); }).length;
            }
            else {
                return 0;
            }
        };

        $scope.markdownFileCount = function() {
            if (wsModel) {
                const files = wsModel.files;
                const paths = files.keys;
                return paths.filter(function(path) { return isMarkdownFilePath(path); }).length;
            }
            else {
                return 0;
            }
        };

        $scope.doView = (path: string): void => {
            const file = wsModel.findFileByPath(path);
            if (file) {
                try {
                    wsModel.setPreviewFile(path);
                    // The user probably wants to see the view, so make sure the view is visible.
                    $scope.isViewVisible = true;
                    $scope.updatePreview(WAIT_NO_MORE);
                }
                finally {
                    file.release();
                }
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

        $scope.comments = [];

        $scope.toggleCommentsVisible = (label?: string, value?: number) => {
            ga('send', 'event', 'doodle', 'toggleCommentsVisible', label, value);
            $scope.isCommentsVisible = !$scope.isCommentsVisible;
            if ($scope.isCommentsVisible) {
                // Experimenting with making these mutually exclusive.
                $scope.isReadMeVisible = false;
                github.getGistComments(wsModel.gistId).then((httpResponse) => {
                    const comments = httpResponse.data;
                    $scope.comments = comments.map(function(comment) {
                        return {type: 'info', msg: comment.body};
                    });
                }).catch((reason) => {
                    console.warn(`getGistComments(${wsModel.gistId}) failed: ${reason}`);
                });
            }
        };

        $scope.toggleReadMeVisible = (label?: string, value?: number) => {
            ga('send', 'event', 'doodle', 'toggleReadMeVisible', label, value);
            $scope.isReadMeVisible = !$scope.isReadMeVisible;
            if ($scope.isReadMeVisible) {
                $scope.isCommentsVisible = false;
            }
            this.updateReadmeView(WAIT_NO_MORE);
        };

        $scope.doLabel = (label?: string, value?: number) => {
            ga('send', 'event', 'doodle', 'label', label, value);
            // TODO: This really needs some refactoring.
            // TODO: If execute() is to take no parameters then everything must be based on service state.
            const labelFlow = new LabelFlow(
                $scope.userLogin(),
                this.flowService,
                this.labelDialog,
                wsModel);
            labelFlow.execute();
        };

        $scope.doProperties = (label?: string, value?: number) => {
            ga('send', 'event', 'doodle', 'properties', label, value);
            // TODO: This really needs some refactoring.
            const propertiesFlow = new PropertiesFlow(
                $scope.userLogin(),
                this.options,
                this.olds,
                this.FILENAME_TYPESCRIPT_CURRENT_LIB_DTS,
                this.$http,
                this.$location,
                this.VENDOR_FOLDER_MARKER,
                this.flowService,
                this.propertiesDialog,
                wsModel);
            propertiesFlow.execute();
        };

        $scope.doPublish = (label?: string, value?: number) => {
            ga('send', 'event', 'doodle', 'upload', label, value);
            // TODO: This really needs some refactoring.
            const publishFlow = new PublishFlow(
                $scope.userLogin(),
                this.flowService,
                this.modalDialog,
                this.publishDialog,
                this.credentials,
                this.stemcArXiv,
                wsModel);
            publishFlow.execute();
        };

        $scope.doUpload = (label?: string, value?: number) => {
            ga('send', 'event', 'doodle', 'upload', label, value);
            // TODO: This really needs some refactoring.
            const uploadFlow = new UploadFlow(
                $scope.userLogin(),
                this.$state,
                this.flowService,
                this.modalDialog,
                this.cloud,
                this.github,
                wsModel);
            uploadFlow.execute();
        };

        // const endTime = performance.now();
        // console.lg(`Workspace.controller took ${endTime - startTime} ms.`);
    }

    /**
     * This lifecycle hook will be executed when all controllers on an element have been constructed,
     * and after their bindings are initialized. This hook is meant to be used for any kind of
     * initialization work of a controller.
     */
    $onInit(): void {
        console.log("WorkspaceController.$onInit");
        // Let the works
        this.wsModel.recycle();

        const owner: string = this.$stateParams['owner'];
        const repo: string = this.$stateParams['repo'];
        const gistId: string = this.$stateParams['gistId'];
        // TODO: It's a bit wierd that this looks like it has a side effect on the workspace.
        // If we had multiple workspace then the workspace would be a parameter.

        // This flag prevents the editors from being being 
        this.$scope.doodleLoaded = false;

        this.background.loadWsModel(owner, repo, gistId, (err: Error) => {
            console.log(`loadWsModel completed ${JSON.stringify(err, null, 2)}`);
            if (!err) {
                // We don't need to load anything, but are we in the correct state for the Doodle?
                // We end up here, e.g., when user presses Cancel from New dialog.
                if (gistId && this.FEATURE_GIST_ENABLED && !this.$state.is(this.STATE_GIST, { gistId })) {
                    this.$state.go(this.STATE_GIST, { gistId: this.wsModel.gistId });
                }
                else if (owner && repo && this.FEATURE_REPO_ENABLED && !this.$state.is(this.STATE_REPO, { owner, repo })) {
                    this.$state.go(this.STATE_REPO, { owner: this.wsModel.owner, repo: this.wsModel.repo });
                }
                else {
                    // We are in the correct state.
                    console.log("The workspace model has been loaded successfully.");
                    this.$scope.doodleLoaded = true;
                    this.startWorkspaceThread((err) => {
                        if (!err) {
                            this.afterWorkspaceStarted();
                        }
                        else {
                            this.modalDialog.alert({title: "Start Workspace Error", message: err.message});
                        }
                    });
                }
            }
            else {
                this.modalDialog.alert({title: "Load Workspace Error", message: err.message});
            }
        });
    }

    private startWorkspaceThread(callback: (err: Error) => any): void {
        // const startTime = performance.now();

        this.wsModel.initialize((err) => {
            if (!err) {
                // this.workspace.trace = true;
                // this.workspace.setTrace(true);
                this.wsModel.setDefaultLibrary('/typings/lib.es6.d.ts');

                // Following a browser refresh, show the code so that it refreshes correctly (bug).
                // This also side-steps the issue of the time it takes to restart the preview.
                // Ideally we remove this line and use the cached `lastKnownJs` to provide the preview.
                this.wsModel.isCodeVisible = true;

                this.watches.push(this.$scope.$watch('isViewVisible', (newVal: boolean, oldVal, unused: angular.IScope) => {
                    this.wsModel.isViewVisible = this.$scope.isViewVisible;
                }));

                this.watches.push(this.$scope.$watch('isEditMode', (newVal: boolean, oldVal, unused: angular.IScope) => {
                    this.wsModel.isCodeVisible = this.$scope.isEditMode;
                }));
                callback(void 0);
            }
            else {
                callback(new Error(`The workspace failed to initialize: ${err}`));
            }
        });



        // const endTime = performance.now();
        // console.lg(`Workspace.$onInit took ${endTime - startTime} ms.`);
    }

    /**
     * This lifecycle hook that is called when its containing scope is destroyed.
     * We can use this hook to release external resources, watches and event handlers.
     */
    $onDestroy(): void {
        console.log("WorkspaceController.$onDestroy");
        // const startTime = performance.now();

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
        if (this.resizeListener) {
            this.$window.removeEventListener('resize', this.resizeListener);
            this.resizeListener = void 0;
        }

        this.wsModel.terminate();
        this.wsModel.dispose();

        // const endTime = performance.now();
        // console.lg(`Workspace.$onDestroy took ${endTime - startTime} ms.`);
    }

    /**
     * 
     */
    private afterWorkspaceStarted(): void {
        // const startTime = performance.now();

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

        // Bit of a smell here. Should we be updating the scope?
        this.$scope.isEditMode = this.wsModel.isCodeVisible;
        // Don't start in Playing mode in case the user has a looping program (give chance to fix the code).
        this.$scope.isViewVisible = false;
        // Don't display comments initially to keep things clean.
        this.$scope.isCommentsVisible = false;
        // No such issue with the README.md
        this.$scope.isReadMeVisible = true;

        // FIXME: Some work to do in getting all the async work done right.
        // TOOD: This needs a flow to manage the nesting and sequencing.
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
                this.wsModel.setModuleKind(moduleKind);

                // Set the script target for transpilation consistent with the version.
                const scriptTarget = detect1x(this.wsModel) ? SCRIPT_TARGET_ES5 : SCRIPT_TARGET_ES5;
                this.wsModel.setScriptTarget(scriptTarget);

                this.wsModel.synchronize()
                    .then(() => {
                        // FIXME: Need a callback here...
                        this.wsModel.semanticDiagnostics();
                        this.wsModel.outputFiles();
                        this.$scope.workspaceLoaded = true;
                        this.$scope.updatePreview(WAIT_NO_MORE);
                    })
                    .catch((reason: any) => {
                        console.warn(`Unable to synchronize the workspace because ${reason}.`);
                    });
            });

        // const endTime = performance.now();
        // console.lg(`Workspace.onInitDoodle took ${endTime - startTime} ms.`);
    }

    /**
     * Do what needs to be done when the window is resized.
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
     * @param path
     * @param mode
     * @param editor
     */
    attachEditor(path: string, mode: string, editor: Editor): () => void {
        // const startTime = performance.now();
        this.wsModel.attachEditor(path, editor);

        switch (mode) {
            case LANGUAGE_PYTHON: {
                // TODO:
                // editor.getSession().on('change', this.createChangeHandler(path));
                editor.getSession().on('outputFiles', this.createOutputFilesEventHandler(path));
                break;
            }
            case LANGUAGE_TYPE_SCRIPT: {
                editor.getSession().on('outputFiles', this.createOutputFilesEventHandler(path));
                break;
            }
            case LANGUAGE_JAVA_SCRIPT: {
                // TODO: We probably don't get anything for JavaScript.
                editor.getSession().on('outputFiles', this.createOutputFilesEventHandler(path));
                break;
            }
            case LANGUAGE_CSS:
            case LANGUAGE_JSON:
            case LANGUAGE_HTML:
            case LANGUAGE_LESS:
            case LANGUAGE_TEXT: {
                editor.getSession().on('change', this.createChangeHandler(path));
                break;
            }
            case LANGUAGE_MARKDOWN: {
                this.addReadmeChangeHandler(path, editor);
                break;
            }
            default: {
                console.warn(`attachEditor(mode => ${mode}) is being ignored.`);
            }
        }
        this.editors[path] = editor;
        // The editors are attached after $onInit and so we miss the initial resize.
        editor.resize(true);

        // const endTime = performance.now();
        // console.lg(`Workspace.attachEditor(${filename}) ${endTime - startTime} ms.`);
        return () => {
            this.detachEditor(path, mode, editor);
        };
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
            const outputFiles = event.data;
            outputFiles.forEach((outputFile: OutputFile) => {
                if (typeof this.wsModel.lastKnownJs !== 'object') {
                    this.wsModel.lastKnownJs = {};
                }
                // TODO: The output files could be both JavaScript and d.ts
                // We should be sure to only select the JavaScript file. 
                if (this.wsModel.lastKnownJs[filename] !== outputFile.text) {
                    // if (this.cascade) {
                    this.wsModel.lastKnownJs[filename] = outputFile.text;
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
            if (this.wsModel) {
                this.$scope.updatePreview(WAIT_FOR_MORE_OTHER_KEYSTROKES);
            }
        };
        this.changeHandlers[filename] = handler;
        return handler;
    }

    private createReadmeChangeHandler(filename: string): ChangeHandler {
        const handler = (delta: Delta, session: EditSession) => {
            if (this.wsModel) {
                this.updateReadmeView(WAIT_FOR_MORE_README_KEYSTROKES);
            }
        };
        this.readmeChangeHandlers[filename] = handler;
        return handler;
    }

    private updateReadmeView(delay: number) {
        // Throttle the requests to update the README view.
        if (this.readmePromise) { this.$timeout.cancel(this.readmePromise); }
        this.readmePromise = this.$timeout(() => { rebuildReadmeView(
            this.wsModel,
            this.FILENAME_README,
            this.$scope,
            this.$window
        ); this.readmePromise = undefined; }, delay);
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
     * 
     */
    detachEditor(path: string, mode: string, editor: Editor): void {
        // const startTime = performance.now();

        switch (mode) {
            case LANGUAGE_TYPE_SCRIPT: {
                const handler = this.outputFilesEventHandlers[path];
                editor.getSession().off('outputFiles', handler);
                this.deleteOutputFileHandler(path);
                break;
            }
            case LANGUAGE_JAVA_SCRIPT: {
                const handler = this.outputFilesEventHandlers[path];
                editor.getSession().off('outputFiles', handler);
                this.deleteOutputFileHandler(path);
                break;
            }
            case LANGUAGE_PYTHON: {
                const handler = this.outputFilesEventHandlers[path];
                editor.getSession().off('outputFiles', handler);
                this.deleteOutputFileHandler(path);
                break;
            }
            case LANGUAGE_CSS:
            case LANGUAGE_HTML:
            case LANGUAGE_JSON:
            case LANGUAGE_LESS:
            case LANGUAGE_TEXT: {
                const handler = this.changeHandlers[path];
                editor.getSession().off('change', handler);
                this.deleteChangeHandler(path);
                break;
            }
            case LANGUAGE_MARKDOWN: {
                this.removeReadmeChangeHandler(path, editor);
                break;
            }
            default: {
                console.warn(`detachEditor(mode => ${mode}) is being ignored.`);
            }
        }
        this.wsModel.detachEditor(path, editor);
        delete this.editors[path];

        // const endTime = performance.now();
        // console.lg(`Workspace.detachEditor(${path}) ${endTime - startTime} ms.`);
    }
}
