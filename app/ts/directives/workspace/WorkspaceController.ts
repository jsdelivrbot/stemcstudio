import * as ng from 'angular';
import CredentialsService from '../../services/credentials/CredentialsService';
import Base64Service from '../../services/base64/Base64Service';
import Delta from '../../widgets/editor/Delta';
import Editor from '../../widgets/editor/Editor';
import EditSession from '../../widgets/editor/EditSession';
import OutputFile from '../../widgets/editor/workspace/OutputFile';
import CloudService from '../../services/cloud/CloudService';
import detect1x from './detect1x';
import Doodle from '../../services/doodles/Doodle';
import IDoodleManager from '../../services/doodles/IDoodleManager';
import GitHubService from '../../services/github/GitHubService';
import LabelDialog from '../../modules/publish/LabelDialog';
import LabelFlow from './LabelFlow';
import PublishFlow from './PublishFlow';
import IGitHubAuthManager from '../../services/gham/IGitHubAuthManager';
import IOptionManager from '../../services/options/IOptionManager';
import isString from '../../utils/isString';
import ChangeHandler from './ChangeHandler';
import OutputFileHandler from './OutputFileHandler';
import doodleGroom from '../../utils/doodleGroom';
import ModalDialog from '../../services/modalService/ModalDialog';
import PublishDialog from '../../modules/publish/PublishDialog';
import FlowService from '../../services/flow/FlowService';
import UploadFlow from './UploadFlow';
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
import updateWorkspace from './updateWorkspace';
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
        'base64',
        'GitHub',
        'GitHubAuthManager',
        'cloud',
        'templates',
        'flow',
        'ga',
        'doodles',
        'labelDialog',
        'modalDialog',
        'options',
        'publishDialog',
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
        private credentials: CredentialsService,
        private base64: Base64Service,
        private github: GitHubService,
        authManager: IGitHubAuthManager,
        private cloud: CloudService,
        templates: Doodle[],
        private flowService: FlowService,
        ga: UniversalAnalytics.ga,
        private doodles: IDoodleManager,
        private labelDialog: LabelDialog,
        private modalDialog: ModalDialog,
        private options: IOptionManager,
        private publishDialog: PublishDialog,
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
            rebuildPromise = $timeout(() => { rebuildPreview(
                doodles.current(),
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

        $scope.currentDoodle = function() {
            return doodles.current();
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

        $scope.doLabel = (label?: string, value?: number) => {
            ga('send', 'event', 'doodle', 'label', label, value);
            const labelFlow = new LabelFlow($scope.userLogin(), this.doodles,this.flowService,this.labelDialog);
            labelFlow.execute();
        };

        $scope.doPublish = (label?: string, value?: number) => {
            ga('send', 'event', 'doodle', 'upload', label, value);
            const publishFlow = new PublishFlow($scope.userLogin(), this.doodles,this.flowService,this.publishDialog, this.credentials);
            publishFlow.execute();
        };

        $scope.doUpload = (label?: string, value?: number) => {
            ga('send', 'event', 'doodle', 'upload', label, value);
            const uploadFlow = new UploadFlow($scope.userLogin(),this.$state, this.doodles, this.flowService, this.modalDialog, this.cloud, this.github);
            uploadFlow.execute();
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
        updateWorkspace(
            this.workspace,
            this.doodles.current(),
            this.options,
            this.olds,
            this.FILENAME_TYPESCRIPT_CURRENT_LIB_DTS,
            this.$http,
            this.$location,
            this.VENDOR_FOLDER_MARKER);

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
        this.readmePromise = this.$timeout(() => { rebuildReadmeView(
            this.doodles.current(),
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
}
