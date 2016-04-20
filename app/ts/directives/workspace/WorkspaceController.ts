import * as angular from 'angular';
import ace from 'ace.js';
import sd from 'showdown';
import ICloud from '../../services/cloud/ICloud';
import CookieService from '../../services/cookie/CookieService';
import detect1x from './detect1x';
import Doodle from '../../services/doodles/Doodle';
import fileContent from './fileContent';
import fileExists from './fileExists';
import IDoodleManager from '../../services/doodles/IDoodleManager';
import GitHubService from '../../services/github/GitHubService';
import IGitHubAuthManager from '../../services/gham/IGitHubAuthManager';
import IOption from '../../services/options/IOption';
import IOptionManager from '../../services/options/IOptionManager';
import ISettingsService from '../../services/settings/ISettingsService';
import ChangeHandler from './ChangeHandler';
import OutputFileHandler from './OutputFileHandler';
import doodleGroom from '../../utils/doodleGroom';
import readMeHTML from './readMeHTML';
import StringSet from '../../utils/StringSet';
import IUuidService from '../../services/uuid/IUuidService';
import mathscript from 'davinci-mathscript';
import WorkspaceScope from '../../scopes/WorkspaceScope';
import WorkspaceMixin from '../editor/WorkspaceMixin';

const WAIT_NO_MORE = 0;
const WAIT_FOR_MORE_CODE_KEYSTROKES = 1500;
const WAIT_FOR_MORE_OTHER_KEYSTROKES = 350;

function namesToOptions(names: string[], options: IOptionManager): IOption[] {
    return options.filter(function(option) { return names.indexOf(option.name) >= 0; });
}
function optionsToNames(options: IOption[]): string[] {
    return options.map(function(option: IOption) { return option.name });
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
                console.error(e);
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
    return sourceString.indexOf(searchString, position) === position
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
        return domain + '/vendor' + fileName.substring(VENDOR_FOLDER_MARKER.length)
    }
    else {
        // TODO: While we migrate options, everything is still local.
        return domain + '/js/' + fileName
    }
}


// The iframe will capture the mouse events that we need to
// resize the output widow. This function
function bubbleIframeMouseMove(iframe: HTMLIFrameElement) {
    // Save any previous onmousemove handler.
    const existingOnMouseMove = iframe.contentWindow.onmousemove

    // Attach a new onmousemove listener.
    iframe.contentWindow.onmousemove = function(e: MouseEvent) {
        // Fire any existing onmousemove listener.
        if (existingOnMouseMove) existingOnMouseMove(e)

        // Create a new event for the this window.
        const evt: MouseEvent = document.createEvent("MouseEvents")

        // We'll need this to offset the mouse move appropriately.
        const boundingClientRect = iframe.getBoundingClientRect()

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
        )

        // Dispatch the mousemove event on the iframe element.
        iframe.dispatchEvent(evt)
    }
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
        'GitHub',
        'GitHubAuthManager',
        'cloud',
        'cookie',
        'templates',
        'uuid4',
        'ga',
        'doodlesKey',
        'doodles',
        'options',
        'FILENAME_META',
        'FILENAME_README',
        'FILENAME_CODE',
        'FILENAME_LIBS',
        'FILENAME_LESS',
        'FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS',
        'FILENAME_TYPESCRIPT_CURRENT_LIB_DTS',
        'STATE_GISTS',
        'STYLE_MARKER',
        'STYLES_MARKER',
        'SCRIPTS_MARKER',
        'CODE_MARKER',
        'LIBS_MARKER',
        'VENDOR_FOLDER_MARKER',
        'settings']

    /**
     * Keep track of the dependencies that are loaded in the workspace.
     */
    private olds: string[] = [];

    private workspace: ace.Workspace = ace.createWorkspace();

    // private cascade = true;

    private outputFilesEventHandlers: { [name: string]: OutputFileHandler } = {}
    private changeHandlers: { [name: string]: ChangeHandler } = {}

    private editors: { [name: string]: ace.Editor } = {}
    private resizeListener: (unused: UIEvent) => any;

    /**
     * @class WorkspaceController
     * @constructor
     * @param $scope {WorkspaceScope}
     */
    constructor(
        private $scope: WorkspaceScope,
        $state: angular.ui.IStateService,
        $stateParams: angular.ui.IStateParamsService,
        private $http: angular.IHttpService,
        private $location: angular.ILocationService,
        private $timeout: angular.ITimeoutService,
        private $window: angular.IWindowService,
        github: GitHubService,
        authManager: IGitHubAuthManager,
        cloud: ICloud,
        cookie: CookieService,
        templates: Doodle[],
        uuid4: IUuidService,
        ga: UniversalAnalytics.ga,
        doodlesKey: string,
        private doodles: IDoodleManager,
        private options: IOptionManager,
        private FILENAME_META: string,
        private FILENAME_README: string,
        private FILENAME_CODE: string,
        private FILENAME_LIBS: string,
        private FILENAME_LESS: string,
        private FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS: string,
        private FILENAME_TYPESCRIPT_CURRENT_LIB_DTS: string,
        STATE_GISTS: string,
        private STYLE_MARKER: string,
        private STYLES_MARKER: string,
        private SCRIPTS_MARKER: string,
        private CODE_MARKER: string,
        private LIBS_MARKER: string,
        private VENDOR_FOLDER_MARKER: string,
        settings: ISettingsService) {

        const systemImports: string[] = ['/jspm_packages/system.js', '/jspm.config.js']
        const workerImports: string[] = systemImports.concat(['/js/ace-workers.js'])
        const typescriptServices = ['/js/typescriptServices.js']

        this.workspace.init('/js/worker.js', workerImports.concat(typescriptServices))
        this.workspace.setDefaultLibrary('/typings/lib.es6.d.ts')

        let rebuildPromise: angular.IPromise<void>
        $scope.updatePreview = (delay: number) => {
            if (rebuildPromise) { $timeout.cancel(rebuildPromise); }
            rebuildPromise = $timeout(() => { this.rebuildPreview(); rebuildPromise = undefined; }, delay)
        }

        // Not sure how best to do this. I don't want loading to trigger processing until ready.
        // let cascade = false;

        const TEXT_CODE_HIDE = "View";
        const TEXT_CODE_SHOW = "Edit";

        function setEditMode(editMode: boolean) {
            $scope.isEditMode = editMode;
            $scope.toggleText = editMode ? TEXT_CODE_HIDE : TEXT_CODE_SHOW;
        }

        const setViewMode = function(isViewVisible: boolean) {
            $scope.isViewVisible = isViewVisible;
        }

        $scope.toggleMode = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'toggleMode', label, value);
            setEditMode(!$scope.isEditMode);
            // Ensure the preview is running when going away from editing.
            if (!$scope.isEditMode) {
                setViewMode(true);
                $scope.updatePreview(WAIT_NO_MORE);
            }
            else {
                if ($scope.isViewVisible) {
                    $scope.updatePreview(WAIT_NO_MORE);
                }
            }
        }

        $scope.toggleView = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'toggleView', label, value)
            setViewMode(!$scope.isViewVisible)
            $scope.updatePreview(WAIT_NO_MORE)
        }

        $scope.updateView = () => {
            this.updateWorkspace();

            // Bit of a smell here. Should we be updating the scope?
            setEditMode(doodles.current().isCodeVisible);
            // Don't start in Playing mode in case the user has a looping program.
            setViewMode(false/*doodles.current().isViewVisible*/);
            $window.document.title = doodles.current().description;
        }

        // Ensure that there is a current doodle i.e. doodles.current() exists.
        if (doodles.length === 0) {
            // If there is no document, construct one based upon the first template.
            doodles.createDoodle($scope.templates[0], "My STEM Project");
        }

        // Perform conversions required for doodle evolution.
        const doodle = doodleGroom(doodles.current());

        // Set the module kind for transpilation consistent with the version.
        const moduleKind = detect1x(doodle) ? 'none' : 'system'
        this.workspace.setModuleKind(moduleKind, function(err: any) {
            if (err) {
                console.warn(`setModuleKind('${moduleKind}') => ${err}`)
            }
        })

        // Set the script target for transpilation consistent with the version.
        const scriptTarget = detect1x(doodle) ? 'es5' : 'es5'
        this.workspace.setScriptTarget(scriptTarget, function(err: any) {
            if (err) {
                console.warn(`setScriptTarget('${scriptTarget}') => ${err}`)
            }
        })

        // Following a browser refresh, show the code so that it refreshes correctly (bug).
        // This also side-steps the issue of the time it takes to restart the preview.
        // Ideally we remove this line and use the cached `lastKnownJs` to provide the preview.
        doodle.isCodeVisible = true;

        // Now that things have settled down...
        doodles.updateStorage();

        const GITHUB_TOKEN_COOKIE_NAME = 'github-token';

        const gistId: string = $stateParams['gistId'];
        if (gistId) {
            // console.log(`gistId => ${gistId}`)
            // console.log(`gistId (current) => ${doodles.current().gistId}`)
            if (doodles.current().gistId !== gistId) {
                const token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
                cloud.downloadGist(token, gistId, function(err: any, doodle: Doodle) {
                    if (!err) {
                        // console.log(`downloaded, gistId => ${doodle.gistId}`)
                        doodles.deleteDoodle(doodle.uuid);
                        doodles.unshift(doodle);
                        doodles.updateStorage();
                        $scope.updateView();
                    }
                    else {
                        $scope.alert("Error attempting to download Gist");
                    }
                    // cascade = true;
                    $scope.updatePreview(WAIT_NO_MORE);
                });
            }
            else {
                // console.log(`We've already got that Gist as current in Local Storage`)
                $scope.updateView();
                // cascade = true;
                $scope.updatePreview(WAIT_NO_MORE);
            }
        }
        else {
            // console.log("There is NO gistId parameter.")
            if (doodles.current().gistId) {
                // console.log("But the current doodle DOES have a gistId")
                $state.go(STATE_GISTS, { gistId: doodles.current().gistId });
            }
            else {
                $scope.updateView();
                // cascade = true;
                $scope.updatePreview(WAIT_NO_MORE);
            }
        }

        $scope.$watch('isViewVisible', function(newVal: boolean, oldVal, unused: angular.IScope) {
            doodles.current().isViewVisible = $scope.isViewVisible;
            doodles.updateStorage();
        });

        $scope.$watch('isEditMode', function(newVal: boolean, oldVal, unused: angular.IScope) {
            doodles.current().isCodeVisible = $scope.isEditMode;
            doodles.updateStorage();
        });
    }

    /**
     * @method $onInit
     * @return {void}
     */
    $onInit(): void {

        this.resizeListener = (unused: UIEvent) => {
            this.resize()
        }

        this.$window.addEventListener('resize', this.resizeListener);

        // Event generated by the grabbar when resize starts.
        this.$scope.$on('angular-resizable.resizeStart', (event: ng.IAngularEvent, data) => {
            // Do nothing.
        })

        // Event generated by the grabbar while resize is happening.
        this.$scope.$on('angular-resizable.resizing', (event: ng.IAngularEvent, data) => {
            // Do nothing to make the sizing smoother.
            // The resize will happen at the end.
        })

        // Event generated by the grabbar when resize ends.
        this.$scope.$on('angular-resizable.resizeEnd', (event: ng.IAngularEvent, data) => {
            // Force the editors to resize after the grabbar has stopped so
            // that the editor knows where its boundaries are. If we don't do this,
            // placing the mouse cursor can cause the editor to jump because it thinks
            // the cursor is not visible.
            this.resize()
        })

        this.resize()
    }

    /**
     * @method $onDestroy
     * @return {void}
     */
    $onDestroy(): void {
        // This method is called BEFORE the child directives make their detachEditor calls.
        this.$window.removeEventListener('resize', this.resizeListener);
    }

    /**
     * Doe what needs to be done when the window is resized.
     */
    private resize(): void {
        const fileNames = Object.keys(this.editors)
        const iLen = fileNames.length
        for (let i = 0; i < iLen; i++) {
            const fileName = fileNames[i]
            const editor = this.editors[fileName]
            editor.resize(true)
        }
    }

    /**
     * @method attachEditor
     * @param filename {string}
     * @param mode {string}
     * @param editor {Editor}
     * @return {void}
     */
    attachEditor(filename: string, mode: string, editor: ace.Editor): void {
        switch (mode) {
            case 'TypeScript': {
                this.workspace.attachEditor(filename, editor)
                editor.getSession().on('outputFiles', this.createOutputFilesEventHandler(filename));
                break;
            }
            case 'JavaScript': {
                // TODO: We probably don't get anything for JavaScript.
                this.workspace.attachEditor(filename, editor)
                editor.getSession().on('outputFiles', this.createOutputFilesEventHandler(filename))
                break
            }
            case 'CSS':
            case 'HTML':
            case 'LESS':
            case 'Markdown': {
                editor.getSession().on('change', this.createChangeHandler(filename))
                break
            }
            default: {
                console.warn(`attachEditor(mode => ${mode}) is being ignored.`)
            }
        }
        this.editors[filename] = editor
        // The editors are attached after $onInit and so we miss the initial resize.
        editor.resize(true)
    }

    private createOutputFilesEventHandler(filename: string): OutputFileHandler {
        const handler = (event: { data: ace.OutputFile[] }, session: ace.EditSession) => {
            // It's OK to capture the current Doodle here, but not outside the handler!
            const doodle = this.doodles.current()
            const outputFiles = event.data
            outputFiles.forEach((outputFile: ace.OutputFile) => {

                if (typeof doodle.lastKnownJs !== 'object') {
                    doodle.lastKnownJs = {}
                }
                // TODO: The output files could be both JavaScript and d.ts
                // We should be sure to only select the JavaScript file. 
                if (doodle.lastKnownJs[filename] !== outputFile.text) {
                    // if (this.cascade) {
                    doodle.lastKnownJs[filename] = outputFile.text
                    this.doodles.updateStorage()
                    this.$scope.updatePreview(WAIT_FOR_MORE_CODE_KEYSTROKES)
                    // }
                }
            })
        }
        this.outputFilesEventHandlers[filename] = handler
        return handler
    }

    private deleteOutputFileHandler(filename) {
        delete this.outputFilesEventHandlers[filename]
    }

    private createChangeHandler(filename: string): ChangeHandler {
        const handler = (delta: ace.Delta, session: ace.EditSession) => {
            if (/* this.cascade && */ this.doodles.current()) {
                this.doodles.updateStorage()
                this.$scope.updatePreview(WAIT_FOR_MORE_OTHER_KEYSTROKES)
            }
        }
        this.changeHandlers[filename] = handler
        return handler
    }

    private deleteChangeHandler(filename) {
        delete this.outputFilesEventHandlers[filename]
    }

    /**
     * @method detachEditor
     * @param filename {string}
     * @param mode {string}
     * @param editor {Editor}
     * @return {void}
     */
    detachEditor(filename: string, mode: string, editor: ace.Editor): void {
        switch (mode) {
            case 'TypeScript': {
                const handler = this.outputFilesEventHandlers[filename]
                editor.getSession().off('outputFiles', handler)
                this.deleteOutputFileHandler(filename)
                this.workspace.detachEditor(filename, editor)
                break
            }
            case 'JavaScript': {
                const handler = this.outputFilesEventHandlers[filename]
                editor.getSession().off('outputFiles', handler)
                this.deleteOutputFileHandler(filename)
                this.workspace.detachEditor(filename, editor)
                break
            }
            case 'CSS':
            case 'HTML':
            case 'LESS':
            case 'Markdown': {
                const handler = this.changeHandlers[filename]
                editor.getSession().off('change', handler)
                this.deleteChangeHandler(filename)
                break
            }
            default: {
                console.warn(`detachEditor(mode => ${mode}) is being ignored.`)
            }
        }
        delete this.editors[filename]
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
            // console.log("The remove list DOES contain the 'lib' dependency.")
            // By removing it from the list, we will keep the 'lib' in the workspace and save an unload/load cycle.
            rmvs.splice(rmvs.indexOf('lib'), 1);
        }
        else {
            // console.log("The remove list does NOT contain the 'lib' dependency.")
        }

        const rmvOpts: IOption[] = namesToOptions(rmvs, this.options);

        const rmvUnits: { name: string; fileName: string }[] = rmvOpts.map(function(option) { return { name: option.name, fileName: option.dts }; });

        const addOpts: IOption[] = namesToOptions(adds, this.options);

        // TODO: Optimize so that we don't keep loading `lib`.
        let addUnits: { name: string; fileName: string }[] = addOpts.map(function(option) { return { name: option.name, fileName: option.dts }; })

        // Ensure that the TypeScript ambient type definitions are present.
        if (this.olds.indexOf('lib') < 0) {
            addUnits = addUnits.concat({ name: 'lib', fileName: this.FILENAME_TYPESCRIPT_CURRENT_LIB_DTS });
        }

        /**
         * The domain on which we are running. e.g., `http://www.mathdoodle.io` or `localhost:8080`.
         * We determine this dynamically in order to access files in known locations on our server.
         * Current usage is for JavaScript files, TypeScript d.ts files, and paths to gists.
         * TODO: JavaScript and TypeScript to come from external repos.
         */
        const FWD_SLASH = '/';
        const DOMAIN = this.$location.protocol() + ':' + FWD_SLASH + FWD_SLASH + this.$location.host() + ":" + this.$location.port();

        const readFile = (fileName: string, callback: (err, data?) => void) => {
            const url = scriptURL(DOMAIN, fileName, this.VENDOR_FOLDER_MARKER)
            this.$http.get(url)
                .success(function(data, status: number, headers, config) {
                    callback(null, data)
                })
                .error(function(data, status: number, headers, config) {
                    callback(new Error("Unable to wrangle #{fileName}."));
                })
        }

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
         * The domain on which we are running. e.g., `http://www.mathdoodle.io` or `localhost:8080`.
         * We determine this dynamically in order to access files in known locations on our server.
         * Current usage is for JavaScript files, TypeScript d.ts files, and paths to gists.
         * TODO: JavaScript and TypeScript to come from external repos.
         */
        const FWD_SLASH = '/';
        const DOMAIN = this.$location.protocol() + ':' + FWD_SLASH + FWD_SLASH + this.$location.host() + ":" + this.$location.port();
        try {
            // Kill any existing frames.
            this.$scope.previewIFrame = undefined;
            const preview = this.$window.document.getElementById('preview');
            if (preview) {
                while (preview.children.length > 0) {
                    preview.removeChild(preview.firstChild);
                }
                const doodle: Doodle = this.doodles.current()
                if (doodle) {
                    const bestFile: string = doodle.getPreviewFileOrBestAvailable()
                    if (bestFile && this.$scope.isViewVisible) {

                        this.$scope.previewIFrame = document.createElement('iframe');
                        // Let's not change any more styles than we have to. 
                        this.$scope.previewIFrame.style.width = '100%';
                        this.$scope.previewIFrame.style.height = '100%';
                        this.$scope.previewIFrame.style.border = '0';
                        this.$scope.previewIFrame.style.backgroundColor = '#ffffff';

                        preview.appendChild(this.$scope.previewIFrame);

                        const content = this.$scope.previewIFrame.contentDocument || this.$scope.previewIFrame.contentWindow.document;

                        let html: string = fileContent(bestFile, doodle)
                        if (typeof html === 'string') {

                            const selOpts: IOption[] = this.options.filter((option: IOption, index: number, array: IOption[]) => {
                                return doodle.dependencies.indexOf(option.name) > -1;
                            });

                            const closureOpts: IOption[] = closure(selOpts, this.options);

                            const chosenCssFileNames: string[] = closureOpts.map(function(option: IOption) { return option.css; }).reduce(function(previousValue, currentValue) { return previousValue.concat(currentValue) }, []);
                            const stylesTags = chosenCssFileNames.map((fileName: string) => {
                                return "<link rel='stylesheet' href='" + scriptURL(DOMAIN, fileName, this.VENDOR_FOLDER_MARKER) + "'></link>\n";
                            });
                            html = html.replace(this.STYLES_MARKER, stylesTags.join(""));

                            const chosenJsFileNames: string[] = closureOpts.map(function(option: IOption) { return option.minJs; }).reduce(function(previousValue, currentValue) { return previousValue.concat(currentValue) }, []);
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
                                console.warn("Support for programs not using ES6 modules is deprecated. Please convert your program to use ES6 module loading.")
                                html = html.replace(this.LIBS_MARKER, currentJavaScript(this.FILENAME_LIBS, doodle));
                                html = html.replace(this.CODE_MARKER, currentJavaScript(this.FILENAME_CODE, doodle));
                                // For backwards compatibility (less than 1.x) ...
                                html = html.replace('<!-- STYLE-MARKER -->', ['<style>', fileContent(this.FILENAME_LESS, doodle), '</style>'].join(""));
                                html = html.replace('<!-- CODE-MARKER -->', currentJavaScript(this.FILENAME_CODE, this.doodles.current()));
                            }
                            else {
                                const modulesJs: string[] = []
                                const names: string[] = Object.keys(doodle.lastKnownJs)
                                const iLen: number = names.length
                                for (let i = 0; i < iLen; i++) {
                                    const name = names[i]
                                    const moduleJs = doodle.lastKnownJs[name]
                                    const moduleMs = doodle.operatorOverloading ? mathscript.transpile(moduleJs) : moduleJs
                                    modulesJs.push(moduleMs)
                                }
                                html = html.replace(this.CODE_MARKER, modulesJs.join('\n'));
                            }

                            content.open()
                            content.write(html)
                            content.close()

                            bubbleIframeMouseMove(this.$scope.previewIFrame)
                        }
                        else {
                            console.warn(`bestFile => ${bestFile}`)
                        }
                    }
                    else {
                        // The view is not visible.
                        this.$scope.previewIFrame = document.createElement('iframe');
                        // Let's not change any more styles than we have to. 
                        this.$scope.previewIFrame.style.width = '100%';
                        this.$scope.previewIFrame.style.height = '100%';
                        this.$scope.previewIFrame.style.border = '0';
                        this.$scope.previewIFrame.style.backgroundColor = '#ffffff';

                        preview.appendChild(this.$scope.previewIFrame);

                        let html = readMeHTML({})

                        const content = this.$scope.previewIFrame.contentDocument || this.$scope.previewIFrame.contentWindow.document;
                        if (fileExists(this.FILENAME_README, doodle)) {
                            const markdown: string = fileContent(this.FILENAME_README, doodle)
                            const converter: sd.Converter = new sd.Converter()
                            const markdownHTML = converter.makeHtml(markdown)
                            html = html.replace('// README.md', markdownHTML);
                        }
                        if (fileExists('README.css', doodle)) {
                            html = html.replace('/* README.css */', fileContent('README.css', doodle));
                        }

                        content.open()
                        content.write(html)
                        content.close()

                        bubbleIframeMouseMove(this.$scope.previewIFrame)
                    }
                }
            }
            else {
                console.warn("There is no #preview element on the doodle page.")
            }
        }
        catch (e) {
            console.warn(e);
        }
    };
}
