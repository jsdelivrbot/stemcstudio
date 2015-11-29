/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../typings/bootstrap-dialog/bootstrap-dialog.d.ts" />
/// <reference path="../../../typings/deuce/deuce.d.ts" />
/// <reference path="../../../typings/davinci-mathscript/davinci-mathscript.d.ts" />
/// <reference path="../../../typings/dialog-polyfill/dialog-polyfill.d.ts" />
/// <reference path="../../../typings/google-analytics/ga.d.ts" />
/// <reference path="../controllers/BodyController.ts" />
/// <reference path="../services/doodles/doodles.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../services/cloud/cloud.ts" />
/// <reference path="../services/cookie/cookie.ts" />
/// <reference path="../services/gham/IGitHubAuthManager.ts" />
/// <reference path="../services/gist/IGist.ts" />
/// <reference path="../services/github/GitHub.ts" />
/// <reference path="../services/options/IOption.ts" />
/// <reference path="../services/options/IOptionManager.ts" />
/// <reference path="../services/settings/settings.ts" />
/// <reference path="../compsci/compsci.ts" />
module mathdoodle {
    export interface IHomeScope extends mathdoodle.IBodyScope {
        /**
         * @param label Used by Universal Analytics to categorize events.
         * @param value Values must be non-negative. Useful to pass counts.
         */
        showHTML: (label?: string, value?: number) => void;
        /**
         * @param label Used by Universal Analytics to categorize events.
         * @param value Values must be non-negative. Useful to pass counts.
         */
        showCode: (label?: string, value?: number) => void;
        /**
         * @param label Used by Universal Analytics to categorize events.
         * @param value Values must be non-negative. Useful to pass counts.
         */
        showLibs: (label?: string, value?: number) => void;
        /**
         * @param label Used by Universal Analytics to categorize events.
         * @param value Values must be non-negative. Useful to pass counts.
         */
        showLess: (label?: string, value?: number) => void;

        isShowingHTML: boolean;
        isShowingCode: boolean;
        isShowingLibs: boolean;
        isShowingLess: boolean;

        isEditMode: boolean;
        toggleText: string;
        toggleMode: () => void;

        isViewVisible: boolean;
        toggleView: () => void;

        doNew: () => void;
        doOpen: () => void;
        doCopy: () => void;
        doProperties(): void;
        doShare: () => void;
        doHelp: () => void;

        doUpload(): void;

        goHome: () => void;

        templates: IDoodle[];

        shareURL: () => string;

        updateView(): void;
        updatePreview(delay: number): void;
        previewIFrame: HTMLIFrameElement;
    }
    export interface IOutputFile {
        name: string;
        writeByteOrderMark: boolean;
        text: string;
        sourceMapEntries: any[];
    }
}

angular.module('app').controller('doodle-controller', [
    '$scope',
    '$state',
    '$stateParams',
    '$http',
    '$location',
    '$timeout',
    '$window',
    '$modal',
    'mathscript',
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
    'FILENAME_HTML',
    'FILENAME_CODE',
    'FILENAME_LIBS',
    'FILENAME_LESS',
    'FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS',
    'FILENAME_TYPESCRIPT_CURRENT_LIB_DTS',
    'STATE_GISTS',
    'STYLE_MARKER',
    'SCRIPTS_MARKER',
    'CODE_MARKER',
    'LIBS_MARKER',
    'VENDOR_FOLDER_MARKER',
    'settings',
    function(
        scope: mathdoodle.IHomeScope,
        $state: angular.ui.IStateService,
        $stateParams: angular.ui.IStateParams,
        http: angular.IHttpService,
        $location: angular.ILocationService,
        $timeout: angular.ITimeoutService,
        $window: angular.IWindowService,
        $modal,
        mathscript,
        github,
        authManager: IGitHubAuthManager,
        cloud: mathdoodle.ICloud,
        cookie: ICookieService,
        templates: mathdoodle.IDoodle[],
        uuid4: IUuidService,
        ga: UniversalAnalytics.ga,
        doodlesKey: string,
        doodles: mathdoodle.IDoodleManager,
        options: IOptionManager,
        FILENAME_META: string,
        FILENAME_HTML: string,
        FILENAME_CODE: string,
        FILENAME_LIBS: string,
        FILENAME_LESS: string,
        FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS: string,
        FILENAME_TYPESCRIPT_CURRENT_LIB_DTS: string,
        STATE_GISTS: string,
        STYLE_MARKER: string,
        SCRIPTS_MARKER: string,
        CODE_MARKER: string,
        LIBS_MARKER: string,
        VENDOR_FOLDER_MARKER: string,
        settings: mathdoodle.ISettingsService
    ) {
        // Disable scrollbars for this editing page ('hidden' and 'auto').
        $window.document.body.style.overflow = "hidden";

        $window.addEventListener('resize', function(e: UIEvent) {
            var toolbar = $window.document.getElementById('toolbar')
            var doodlec = $window.document.getElementById('doodle-container')
            // 5px comes from the border-bottom on the navbar.
            doodlec.style.height = "" + ($window.innerHeight - toolbar.clientHeight - 5) + "px";
        });

        // Not sure how best to do this. I don't want loading to trigger processing until ready.
        var cascade = false;

        // Ensure that scrollbars are disabled.
        // This is so that we don't get double scrollbars when using the editor.
        // I don't think we want this anymore now that we have side-by-side views.
        // $window.document.body.style.overflow = 'hidden'

        var FWD_SLASH = '/';

        var WAIT_NO_MORE = 0;
        var WAIT_FOR_MORE_HTML_KEYSTROKES = 350;
        var WAIT_FOR_MORE_CODE_KEYSTROKES = 1500;
        var WAIT_FOR_MORE_LESS_KEYSTROKES = 350;

        var TEXT_CODE_HIDE = "View";
        var TEXT_CODE_SHOW = "Edit";

        // Reminder: Do not create multiple trackers in this (single page) app.
        ga('create', 'UA-41504069-3', 'auto');
        ga('send', 'pageview');

        var GITHUB_TOKEN_COOKIE_NAME = 'github-token';

        authManager.handleGitHubLoginCallback(function(err, token: string) {
            if (err) {
                scope.alert(err.message);
            }
        });

        // We'll keep the transpiled code here.
        // var outputFile: IOutputFile;

        scope.templates = templates;

        // Temporary to ensure correct Gist deserialization.
        function depArray(deps: { [key: string]: string }): string[] {
            var ds: string[] = [];
            for (var prop in deps) {
                ds.push(prop);
            }
            return ds;
        }

        // Temporary to ensure correct Gist serialization.
        function depObject(names: string[]): { [key: string]: string } {
            function version(name: string): string {
                var matching = options.filter(function(option) { return option.name === name; });
                if (matching.length > 0) {
                    return matching[0].version;
                }
                else {
                    return undefined;
                }
            }
            var obj: { [key: string]: string } = {};
            names.forEach(function(name: string) {
                obj[name] = version(name);
            });
            return obj;
        }

        /**
         * This will be a String method in ECMAScript 6.
         * More robust implementations exist.
         * This lightweight function is adapted from MDN.
         */
        function startsWith(sourceString: string, searchString: string, position: number = 0): boolean {
            return sourceString.indexOf(searchString, position) === position
        }

        /**
         * Creates a copy of a string with whitespace removed.
         */
        function stripWS(sourceString: string): string {
            return sourceString.replace("\n", "").replace("\t", "").replace("\r", "").replace(" ", "")
        }

        /**
         * Computes the URL for a script tag by examining the `fileName`.
         * Files that begin with the special VENDOR_FOLDER_MARKER constant
         * are assumed to be located in the local `vendor` folder of the domain.
         * Otherwise, the fileName is considered to be the URL of a remote server.
         */
        function scriptURL(domain: string, fileName: string): string {
            if (startsWith(fileName, VENDOR_FOLDER_MARKER)) {
                // fileName(s) should be defined as VENDOR_FOLDER_MARKER + '/package/**/*.js'
                return domain + '/vendor' + fileName.substring(VENDOR_FOLDER_MARKER.length)
            }
            else {
                // FIXME: While we migrate options, everything is still local.
                return domain + '/js/' + fileName
            }
        }

        function showModalDialog(dialog: HTMLDialogElement, closeHandler: () => void) {
            if (!dialog.show) {
                // Registering the dialog shims the methods show, showModal and close.
                dialogPolyfill.registerDialog(dialog);
            }
            dialog.addEventListener('close', closeHandler);
            // Firefox compatibility.
            dialog.style.display = '';
            dialog.showModal();
        }

        function hideModalDialog(dialog: HTMLDialogElement, closeHandler: () => void) {
            // Firefox compatibility.
            dialog.style.display = 'none';
            dialog.removeEventListener('close', closeHandler);
        }

        /**
         * Keep track of the dependencies that are loaded in the workspace.
         */
        var olds: string[] = [];

        scope.updateView = function() {
            updateWorkspace();

            htmlEditor.setValue(doodles.current().html, -1);
            htmlEditor.resize(true);
            htmlEditor.gotoLine(0, 0);

            codeEditor.setValue(doodles.current().code, -1);
            codeEditor.resize(true);
            codeEditor.gotoLine(0, 0);

            libsEditor.setValue(doodles.current().libs, -1);
            libsEditor.resize(true);
            libsEditor.gotoLine(0, 0);

            lessEditor.setValue(doodles.current().less, -1);
            lessEditor.resize(true);
            lessEditor.gotoLine(0, 0);
            // Bit of a smell here. Should we be updating the scope?
            setEditMode(doodles.current().isCodeVisible);
            setViewMode(doodles.current().isViewVisible);
            setCurrentEditor(doodles.current().focusEditor);
            $window.document.title = doodles.current().description;
        }

        var setViewMode = function(isViewVisible: boolean) {
            scope.isViewVisible = isViewVisible;
        }

        scope.$watch('isViewVisible', function(newVal: boolean, oldVal, unused: angular.IScope) {
            doodles.current().isViewVisible = scope.isViewVisible;
            doodles.updateStorage();
        });

        function setEditMode(editMode: boolean) {
            scope.isEditMode = editMode;
            scope.toggleText = editMode ? TEXT_CODE_HIDE : TEXT_CODE_SHOW;
        }

        scope.$watch('isEditMode', function(newVal: boolean, oldVal, unused: angular.IScope) {
            doodles.current().isCodeVisible = scope.isEditMode;
            doodles.updateStorage();
        });

        scope.toggleMode = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'toggleMode', label, value);
            setEditMode(!scope.isEditMode);
            // Ensure the preview is running when going away from editing.
            if (!scope.isEditMode) {
                setViewMode(true);
                scope.updatePreview(WAIT_NO_MORE);
            }
            else {
                if (scope.isViewVisible) {
                    scope.updatePreview(WAIT_NO_MORE);
                }
            }
            htmlEditor.resize(true);
            codeEditor.resize(true);
            libsEditor.resize(true);
            lessEditor.resize(true);
        };

        scope.toggleView = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'toggleView', label, value);
            setViewMode(!scope.isViewVisible);
            scope.updatePreview(WAIT_NO_MORE);
        };

        scope.showHTML = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'showHTML', label, value);
            setCurrentEditor(FILENAME_HTML);
        }

        scope.showCode = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'showCode', label, value);
            setCurrentEditor(FILENAME_CODE);
        }

        scope.showLibs = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'showLibs', label, value);
            setCurrentEditor(FILENAME_LIBS);
        }

        scope.showLess = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'showLess', label, value);
            setCurrentEditor(FILENAME_LESS);
        }

        /**
         * Set the current editor based upon fileName and return the appropriate editor object.
         */
        function setCurrentEditor(fileName: string): void {

            function focusEditor(editor: ace.Editor): void {
                editor.focus();
                editor.resize(true);
                if (doodles.current().focusEditor !== fileName) {
                    doodles.current().focusEditor = fileName;
                    doodles.updateStorage();
                }
            }

            // We don't set the focus or go to a line because that would
            // activate the keyboard on a mobile device. The user will
            // want to set the insertion point anyway which will trigger
            // keyboard activation at the right time.
            // Notice that we call `resize` on the editor to force a repaint.
            // We use $timeout to de-conflict the AngularJS digest loop and the repaint.
            if (fileName === FILENAME_CODE) {
                scope.isShowingHTML = false;
                scope.isShowingCode = true;
                scope.isShowingLibs = false;
                scope.isShowingLess = false;
                $timeout(function() { focusEditor(codeEditor) }, 100);
            }
            else if (fileName === FILENAME_LIBS) {
                scope.isShowingHTML = false;
                scope.isShowingCode = false;
                scope.isShowingLibs = true;
                scope.isShowingLess = false;
                $timeout(function() { focusEditor(libsEditor) }, 100);
            }
            else if (fileName === FILENAME_HTML) {
                scope.isShowingHTML = true;
                scope.isShowingCode = false;
                scope.isShowingLibs = false;
                scope.isShowingLess = false;
                $timeout(function() { focusEditor(htmlEditor) }, 100);
            }
            else if (fileName === FILENAME_LESS) {
                scope.isShowingHTML = false;
                scope.isShowingCode = false;
                scope.isShowingLibs = false;
                scope.isShowingLess = true;
                $timeout(function() { focusEditor(lessEditor) }, 100);
            }
            else {
                return setCurrentEditor(FILENAME_CODE);
            }
        }

        scope.doNew = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'new', label, value);
            $state.go('new');
        };

        scope.doOpen = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'open', label, value);
            $state.go('open');
        };

        scope.doCopy = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'copy', label, value);
            $state.go('copy');
        };

        scope.doProperties = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'properties', label, value);
            $state.go('properties', { doodle: doodles.current() });
        };

        /**
         * Maps the doodle to the format required for GitHub.
         */
        function configuration(doodle: mathdoodle.IDoodle): mathdoodle.IDoodleConfig {
            return {
                uuid: doodle.uuid,
                description: doodle.description,
                dependencies: depObject(doodle.dependencies),
                operatorOverloading: doodle.operatorOverloading
            };
        }

        function doodleToGist(doodle: mathdoodle.IDoodle): IGist {
            var gist: IGist = {
                description: doodles.current().description,
                public: true,
                files: {}
            };
            gist.files[FILENAME_META] = { content: JSON.stringify(configuration(doodles.current()), null, 2) };
            if (stripWS(doodles.current().html).length > 0) {
                gist.files[FILENAME_HTML] = { content: doodles.current().html };
            }
            else {
                gist.files[FILENAME_HTML] = { content: '<!DOCTYPE html>\n' };
            }
            if (stripWS(doodles.current().code).length > 0) {
                gist.files[FILENAME_CODE] = { content: doodles.current().code };
            }
            else {
                gist.files[FILENAME_CODE] = { content: '//\n' };
            }
            if (stripWS(doodles.current().libs).length > 0) {
                gist.files[FILENAME_LIBS] = { content: doodles.current().libs };
            }
            else {
                gist.files[FILENAME_LIBS] = { content: '//\n' };
            }
            if (stripWS(doodles.current().less).length > 0) {
                gist.files[FILENAME_LESS] = { content: doodles.current().less };
            }
            else {
                gist.files[FILENAME_LESS] = { content: '//\n' };
            }
            return gist;
        }

        scope.doUpload = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'upload', label, value);
            var token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
            if (token) {
                var data = doodleToGist(doodles.current());
                if (doodles.current().gistId) {
                    github.patchGist(token, doodles.current().gistId, data, function(err, response, status: number, headers, config) {
                        if (err) {
                            if (status === 404) {
                                if (confirm("The Gist associated with your doodle no longer exists.\nWould you like me to disassociate your doodle so that you can create a new Gist?")) {
                                    doodles.current().gistId = undefined;
                                    doodles.updateStorage();
                                }
                            }
                            else {
                                // If the status is 404 then the Gist no longer exists on GitHub.
                                // We might as well set the gistId to undefined and let the user try to POST.
                                alert("status: " + JSON.stringify(status));
                                alert("err: " + JSON.stringify(err));
                                alert("response: " + JSON.stringify(response));
                            }
                        }
                        else {
                            BootstrapDialog.show({
                                type: BootstrapDialog.TYPE_SUCCESS,
                                title: $("<h3>Upload complete</h3>"),
                                message: "Your doodle was successfully uploaded and patched the existing Gist.",
                                buttons: [{
                                    label: "Close",
                                    cssClass: 'btn btn-primary',
                                    action: function(dialog) {
                                        $state.go(STATE_GISTS, { gistId: doodles.current().gistId });
                                        dialog.close();
                                    }
                                }]
                            });
                        }
                    });
                }
                else {
                    github.postGist(token, data, function(err, response, status: number, headers, config) {
                        if (err) {
                            alert("status: " + JSON.stringify(status));
                            alert("err: " + JSON.stringify(err));
                            alert("post response: " + JSON.stringify(response));
                        }
                        else {
                            doodles.current().gistId = response.id;
                            doodles.updateStorage();
                            BootstrapDialog.show({
                                type: BootstrapDialog.TYPE_SUCCESS,
                                title: $("<h3>Upload complete</h3>"),
                                message: "Your doodle was successfully uploaded and associated with a new Gist.",
                                buttons: [{
                                    label: "Close",
                                    cssClass: 'btn btn-primary',
                                    action: function(dialog) {
                                        $state.go(STATE_GISTS, { gistId: doodles.current().gistId });
                                        dialog.close();
                                    }
                                }]
                            });
                        }
                    });
                }
            }
            else {
                BootstrapDialog.alert({
                    type: BootstrapDialog.TYPE_INFO,
                    message: "You must be logged in."
                });
            }
        };

        scope.goHome = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'goHome', label, value);
            $state.go('home');
        };

        scope.shareURL = function() {
            // We're using Hashbang Mode.
            return DOMAIN + '/#!/gists/';
        }

        scope.doShare = function() {
            function returnValueHandler(value: string) {

            }
            var dialog = <HTMLDialogElement>document.getElementById('share-dialog');
            var closeHandler = function() {
                hideModalDialog(dialog, closeHandler);
                if (dialog.returnValue.length > 0) {
                    returnValueHandler(dialog.returnValue);
                }
            };
            showModalDialog(dialog, closeHandler);
        };

        scope.doHelp = function() {
        };

        /**
         * The domain on which we are running. e.g., `http://www.mathdoodle.io` or `localhost:8080`.
         * We determine this dynamically in order to access files in known locations on our server.
         * Current usage is for JavaScript files, TypeScript d.ts files, and paths to gists.
         * TODO: JavaScript and TypeScript to come from external repos.
         */
        var DOMAIN = $location.protocol() + ':' + FWD_SLASH + FWD_SLASH + $location.host() + ":" + $location.port();

        ace.config.set('workerPath', '/js')

        var workspace = ace.workspace();

        var codeEditor = ace.edit($window.document.getElementById('code-editor'), workspace);
        codeEditor.resize(true);
        codeEditor.getSession().setMode('ace/mode/typescript');

        codeEditor.setTheme(settings.theme);
        codeEditor.getSession().setTabSize(settings.indent);
        codeEditor.setShowInvisibles(settings.showInvisibles);
        codeEditor.setFontSize(settings.fontSize);
        codeEditor.setShowPrintMargin(settings.showPrintMargin);
        codeEditor.setDisplayIndentGuides(settings.displayIndentGuides);

        codeEditor.getSession().on('initAfter', function(event) {
            // Not sure when we need to know that the worker has started?
        });

        codeEditor.getSession().on('syntaxErrors', function(event) {
            // I'm not seeing any events by this name!
            console.log("syntaxErrors in codeEditor")
        });

        codeEditor.getSession().on('outputFiles', function(event) {
            var outputFiles: mathdoodle.IOutputFile[] = event.data;
            outputFiles.forEach(function(outputFile: mathdoodle.IOutputFile) {
                // Lazy conversion from string value.
                if (typeof doodles.current().lastKnownJs !== 'object') {
                    doodles.current().lastKnownJs = {};
                }
                if (doodles.current() && doodles.current().lastKnownJs[FILENAME_CODE] !== outputFile.text) {
                    if (cascade) {
                        doodles.current().lastKnownJs[FILENAME_CODE] = outputFile.text;
                        doodles.updateStorage();
                        scope.updatePreview(WAIT_FOR_MORE_CODE_KEYSTROKES);
                    }
                }
            });
        });

        codeEditor.getSession().on('change', function(event) {
            if (cascade && doodles.current()) {
                doodles.current().code = codeEditor.getValue();
                doodles.updateStorage();
                // Don't trigger a change to the preview, that happens
                // when the compiler emits a file.
            }
        });

        var libsEditor = ace.edit($window.document.getElementById('libs-editor'), workspace);
        libsEditor.resize(true);
        libsEditor.getSession().setMode('ace/mode/typescript');

        libsEditor.setTheme(settings.theme);
        libsEditor.getSession().setTabSize(settings.indent);
        libsEditor.setShowInvisibles(settings.showInvisibles);
        libsEditor.setFontSize(settings.fontSize);
        libsEditor.setShowPrintMargin(settings.showPrintMargin);
        libsEditor.setDisplayIndentGuides(settings.displayIndentGuides);

        libsEditor.getSession().on('initAfter', function(event) {
            // Not sure when we need to know that the worker has started?
        });

        libsEditor.getSession().on('syntaxErrors', function(event) {
            // I'm not seeing any events by this name!
        });

        libsEditor.getSession().on('outputFiles', function(event) {
            var outputFiles: mathdoodle.IOutputFile[] = event.data;
            outputFiles.forEach(function(outputFile: mathdoodle.IOutputFile) {
                // Lazy conversion from legacy string value.
                if (typeof doodles.current().lastKnownJs !== 'object') {
                    doodles.current().lastKnownJs = {};
                }
                if (doodles.current() && doodles.current().lastKnownJs[FILENAME_LIBS] !== outputFile.text) {
                    if (cascade) {
                        doodles.current().lastKnownJs[FILENAME_LIBS] = outputFile.text;
                        doodles.updateStorage();
                        scope.updatePreview(WAIT_FOR_MORE_CODE_KEYSTROKES);
                    }
                }
            });
        });

        libsEditor.getSession().on('change', function(event) {
            if (cascade && doodles.current()) {
                doodles.current().libs = libsEditor.getValue();
                doodles.updateStorage();
                // Don't trigger a change to the preview, that happens
                // when the compiler emits a file.
            }
        });

        var htmlEditor = ace.edit($window.document.getElementById('html-editor'), workspace);
        htmlEditor.resize(true);
        htmlEditor.getSession().setMode('ace/mode/html');

        htmlEditor.setTheme(settings.theme);
        htmlEditor.getSession().setTabSize(settings.indent);
        htmlEditor.setShowInvisibles(settings.showInvisibles);
        htmlEditor.setFontSize(settings.fontSize);
        htmlEditor.setShowPrintMargin(settings.showPrintMargin);
        htmlEditor.setDisplayIndentGuides(settings.displayIndentGuides);

        htmlEditor.getSession().on('change', function(event) {
            if (cascade && doodles.current()) {
                doodles.current().html = htmlEditor.getValue();
                doodles.updateStorage();
                scope.updatePreview(WAIT_FOR_MORE_HTML_KEYSTROKES);
            }
        });

        var lessEditor = ace.edit($window.document.getElementById('less-editor'), workspace);
        lessEditor.resize(true);
        lessEditor.getSession().setMode('ace/mode/less');

        lessEditor.setTheme(settings.theme);
        lessEditor.getSession().setTabSize(settings.indent);
        lessEditor.setShowInvisibles(settings.showInvisibles);
        lessEditor.setFontSize(settings.fontSize);
        lessEditor.setShowPrintMargin(settings.showPrintMargin);
        lessEditor.setDisplayIndentGuides(settings.displayIndentGuides);

        lessEditor.getSession().on('change', function(event) {
            if (cascade && doodles.current()) {
                doodles.current().less = lessEditor.getValue();
                doodles.updateStorage();
                scope.updatePreview(WAIT_FOR_MORE_LESS_KEYSTROKES);
            }
        });

        var rebuildPromise: angular.IPromise<void>;
        scope.updatePreview = function(delay: number) {
            if (rebuildPromise) { $timeout.cancel(rebuildPromise); }
            rebuildPromise = $timeout(function() { rebuildPreview(); rebuildPromise = undefined; }, delay);
        }

        function namesToOptions(names: string[]): IOption[] {
            return options.filter(function(option) { return names.indexOf(option.name) >= 0; });
        }

        function optionsToNames(options: IOption[]): string[] {
            return options.map(function(option: IOption) { return option.name });
        }

        /**
         * Compute the closure of the options.
         */
        function closure(options: IOption[]): IOption[] {
            var nameSet = new compsci.StringSet();
            options.forEach(function(option) {
                nameSet.add(option.name);
            });
            var done = false;
            while (!done) {
                var size = nameSet.size();
                // FIXME: This only computes the closure. It does not sort into for dependencies.
                namesToOptions(nameSet.toArray()).forEach(function(option: IOption) {
                    for (var name in option.dependencies) {
                        nameSet.add(name);
                    }
                });

                done = size === nameSet.size();
            }
            return namesToOptions(nameSet.toArray());
        }

        /**
         * Returns the JavaScript to be inserted into the HTML script element.
         * This may involve further modifying the JavaScript emitted by the
         * TypeScript compiler by, for example, introducing operator overloading. 
         */
        function currentJavaScript(fileName: string): string {
            var code = doodles.current().lastKnownJs[fileName];
            if (code) {
                if (doodles.current().operatorOverloading) {
                    try {
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

        // The iframe will capture the mouse events that we need to
        // resize the output widow. This function
        function bubbleIframeMouseMove(iframe: HTMLIFrameElement) {
            // Save any previous onmousemove handler.
            var existingOnMouseMove = iframe.contentWindow.onmousemove

            // Attach a new onmousemove listener.
            iframe.contentWindow.onmousemove = function(e: MouseEvent) {
                // Fire any existing onmousemove listener.
                if (existingOnMouseMove) existingOnMouseMove(e)

                // Create a new event for the this window.
                var evt: MouseEvent = document.createEvent("MouseEvents")

                // We'll need this to offset the mouse move appropriately.
                var boundingClientRect = iframe.getBoundingClientRect()

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

        function rebuildPreview() {
            try {
                // Kill any existing frames.
                scope.previewIFrame = undefined;
                var preview = $window.document.getElementById('preview');
                if (preview) {
                    while (preview.children.length > 0) {
                        preview.removeChild(preview.firstChild);
                    }

                    if (scope.isViewVisible && doodles.current() && (typeof doodles.current().lastKnownJs[FILENAME_CODE] === 'string') && (typeof doodles.current().lastKnownJs[FILENAME_LIBS] === 'string')) {
                        scope.previewIFrame = document.createElement('iframe');
                        scope.previewIFrame.style.width = '100%';
                        scope.previewIFrame.style.height = '100%';
                        scope.previewIFrame.style.border = '0';
                        scope.previewIFrame.style.backgroundColor = '#232323';

                        preview.appendChild(scope.previewIFrame);

                        var content = scope.previewIFrame.contentDocument || scope.previewIFrame.contentWindow.document;

                        var selOpts: IOption[] = options.filter(function(option: IOption, index: number, array: IOption[]) {
                            return doodles.current().dependencies.indexOf(option.name) > -1;
                        });

                        var closureOpts: IOption[] = closure(selOpts);

                        var chosenFileNames: string[] = closureOpts.map(function(option: IOption) { return option.minJs; });
                        // TODO: We will later want to make operator overloading configurable for speed.

                        var scriptFileNames: string[] = doodles.current().operatorOverloading ? chosenFileNames.concat(FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS) : chosenFileNames;
                        // TOOD: Don't fix the location of the JavaScript here.
                        var scriptTags = scriptFileNames.map(function(fileName: string) {
                            // FIXME
                            return "<script src='" + scriptURL(DOMAIN, fileName) + "'></script>\n";
                        });

                        var html = doodles.current().html;
                        html = html.replace(SCRIPTS_MARKER, scriptTags.join(""));
                        html = html.replace(STYLE_MARKER, [doodles.current().less].join(""));
                        html = html.replace(LIBS_MARKER, currentJavaScript(FILENAME_LIBS));
                        html = html.replace(CODE_MARKER, currentJavaScript(FILENAME_CODE));
                        // For backwards compatibility...
                        html = html.replace('<!-- STYLE-MARKER -->', ['<style>', doodles.current().less, '</style>'].join(""));
                        html = html.replace('<!-- CODE-MARKER -->', currentJavaScript(FILENAME_CODE));

                        content.open()
                        if (false) {
                            console.log("HTML")
                            console.log("----")
                            console.log(html)
                        }
                        content.write(html)
                        content.close()

                        bubbleIframeMouseMove(scope.previewIFrame)
                    }
                    else {
                        // Do nothing
                    }
                }
                else {
                    // There is no reserved element on the doodle page.
                }
            }
            catch (e) {
                console.error(e);
            }
        };

        /**
         * Update the scripts that the workspace uses to type-check the code.
         * This involves comparing the dependencies of the doodle to the
         * units that are already loaded. We compute those that must be added
         * and those that must be removed from the workspace in order to minimize
         * network traffic and to ensure that the doodle defines the correct dependencies.
         */
        function updateWorkspace() {
            // Load the wokspace with the appropriate TypeScript definitions.
            var news: string[] = optionsToNames(closure(namesToOptions(doodles.current().dependencies)));

            // Determine what we need to add and remove from the workspace.
            var adds: string[] = news.filter(function(dep) { return olds.indexOf(dep) < 0; });
            var rmvs: string[] = olds.filter(function(dep) { return news.indexOf(dep) < 0; });

            // The following is not essential, as `lib` is not an option, it's always there.
            // However, we do it to be explicit.
            if (rmvs.indexOf('lib') >= 0) {
                rmvs.splice(rmvs.indexOf('lib'), 1);
            }

            var rmvOpts: IOption[] = namesToOptions(rmvs);

            var rmvUnits: { name: string; fileName: string }[] = rmvOpts.map(function(option) { return { name: option.name, fileName: option.dts }; });

            var addOpts: IOption[] = namesToOptions(adds);

            // TODO: Optimize so that we don't keep loading `lib`.
            var addUnits: { name: string; fileName: string }[] = addOpts.map(function(option) { return { name: option.name, fileName: option.dts }; })
            if (olds.indexOf('lib') < 0) {
                addUnits = addUnits.concat({ name: 'lib', fileName: FILENAME_TYPESCRIPT_CURRENT_LIB_DTS });
            }

            var readFile = function(fileName: string, callback: (err, data?) => void) {
                var url = scriptURL(DOMAIN, fileName)
                http.get(url)
                    .success(function(data, status: number, headers, config) {
                        callback(null, data)
                    })
                    .error(function(data, status: number, headers, config) {
                        callback(new Error("Unable to wrangle #{fileName}."));
                    })
            }

            rmvUnits.forEach(function(rmvUnit) {
                workspace.removeScript(rmvUnit.fileName);
                olds.splice(olds.indexOf(rmvUnit.name), 1);
            });

            addUnits.forEach(function(addUnit) {
                readFile(addUnit.fileName, function(err, content) {
                    if (!err) {
                        if (workspace) {
                            workspace.ensureScript(addUnit.fileName, content.replace(/\r\n?/g, '\n'), true);
                            olds.unshift(addUnit.name);
                        }
                        else {
                        }
                    }
                });
            });
        }

        function init() {
            if (doodles.length === 0) {
                // If there is no document, construct one based upon the first template.
                doodles.createDoodle(scope.templates[0], "My Math Doodle");
            }
            else {

            }
            if (typeof doodles.current().html !== 'string') {
                doodles.current().html = "";
            }
            if (typeof doodles.current().code !== 'string') {
                doodles.current().code = "";
            }
            if (typeof doodles.current().libs !== 'string') {
                doodles.current().libs = "";
            }
            if (typeof doodles.current().less !== 'string') {
                doodles.current().less = "";
            }
            // We are now guaranteed that there is a current doodle i.e. doodles.current() exists.

            // Following a browser refresh, show the code so that it refreshes correctly (bug).
            // This also side-steps the issue of the time it takes to restart the preview.
            // Ideally we remove this line and use the cached `lastKnownJs` to provide the preview.
            doodles.current().isCodeVisible = true;
            //  doodles.current().isViewVisible = false;
            // We need to make sure that the files have names (for the TypeScript compiler).
            htmlEditor.changeFile(doodles.current().html, FILENAME_HTML, -1);
            htmlEditor.resize(true);
            codeEditor.changeFile(doodles.current().code, FILENAME_CODE, -1);
            codeEditor.resize(true);
            libsEditor.changeFile(doodles.current().libs, FILENAME_LIBS, -1);
            libsEditor.resize(true);
            lessEditor.changeFile(doodles.current().less, FILENAME_LESS, -1);
            lessEditor.resize(true);

            // Now that things have settled down...
            doodles.updateStorage();

            var gistId: string = $stateParams['gistId'];
            if (gistId) {
                if (doodles.current().gistId !== gistId) {
                    var token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
                    cloud.downloadGist(token, gistId, function(err, doodle: mathdoodle.IDoodle) {
                        if (!err) {
                            doodles.deleteDoodle(doodle.uuid);
                            doodles.unshift(doodle);
                            doodles.updateStorage();
                            scope.updateView();
                        }
                        else {
                            scope.alert("Error attempting to download Gist");
                        }
                        cascade = true;
                        scope.updatePreview(WAIT_NO_MORE);
                    });
                }
                else {
                    scope.updateView();
                    cascade = true;
                    scope.updatePreview(WAIT_NO_MORE);
                }
            }
            else {
                if (doodles.current().gistId) {
                    $state.go(STATE_GISTS, { gistId: doodles.current().gistId });
                }
                else {
                    scope.updateView();
                    cascade = true;
                    scope.updatePreview(WAIT_NO_MORE);
                }
            }
        }

        init();
    }]);