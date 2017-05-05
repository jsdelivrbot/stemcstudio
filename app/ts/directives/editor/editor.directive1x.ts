import { isUndefined } from 'angular';
import { IAttributes, IAugmentedJQuery, IDirective, INgModelController, ITimeoutService, ITranscludeFunction } from 'angular';
import applyTextChanges from './applyTextChanges';
import ClojureMode from '../../editor/mode/ClojureMode';
import { ACE_WORKER_PATH } from '../../constants';
import { TYPESCRIPT_SERVICES_PATH } from '../../constants';
import { COMMAND_NAME_FIND } from '../../editor/editor_protocol';
import { COMMAND_NAME_INDENT } from '../../editor/editor_protocol';
import CssMode from '../../editor/mode/CssMode';
import GlslMode from '../../editor/mode/GlslMode';
import HaskellMode from '../../editor/mode/HaskellMode';
import HtmlMode from '../../editor/mode/HtmlMode';
import JavaScriptMode from '../../editor/mode/JavaScriptMode';
import JsxMode from '../../editor/mode/JsxMode';
import JsonMode from '../../editor/mode/JsonMode';
import MarkdownMode from '../../editor/mode/MarkdownMode';
import PythonMode from '../../editor/mode/PythonMode';
import TextMode from '../../editor/mode/TextMode';
import TypeScriptMode from '../../editor/mode/TypeScriptMode';
import TsxMode from '../../editor/mode/TsxMode';
import XmlMode from '../../editor/mode/XmlMode';
import YamlMode from '../../editor/mode/YamlMode';
import UndoManager from '../../editor/UndoManager';
import EditorScope from './EditorScope';
import FormatCodeSettings from '../../editor/workspace/FormatCodeSettings';
import IndentStyle from '../../editor/workspace/IndentStyle';
import showErrorMarker from '../../editor/ext/showErrorMarker';
import showFindReplace from '../../editor/ext/showFindReplace';
import showGreekKeyboard from '../../editor/ext/showGreekKeyboard';
import { showKeyboardShortcuts } from '../../editor/ext/showKeyboardShortcuts';
import { EDITOR_PREFERENCES_SERVICE } from '../../modules/editors/constants';
import EditorPreferencesService from '../../modules/editors/EditorPreferencesService';
import EditorPreferencesEvent from '../../modules/editors/EditorPreferencesEvent';
import { currentTheme } from '../../modules/editors/EditorPreferencesEvent';
import { WorkspaceEditorHost } from '../../directives/editor/WorkspaceEditorHost';
import { LANGUAGE_CSS } from '../../languages/modes';
import { LANGUAGE_CSV } from '../../languages/modes';
import { LANGUAGE_GLSL } from '../../languages/modes';
import { LANGUAGE_HASKELL } from '../../languages/modes';
import { LANGUAGE_HTML } from '../../languages/modes';
import { LANGUAGE_JAVA_SCRIPT } from '../../languages/modes';
import { LANGUAGE_JSX } from '../../languages/modes';
import { LANGUAGE_JSON } from '../../languages/modes';
import { LANGUAGE_LESS } from '../../languages/modes';
import { LANGUAGE_MARKDOWN } from '../../languages/modes';
import { LANGUAGE_PYTHON } from '../../languages/modes';
import { LANGUAGE_SCHEME } from '../../languages/modes';
import { LANGUAGE_TEXT } from '../../languages/modes';
import { LANGUAGE_TSX } from '../../languages/modes';
import { LANGUAGE_TYPE_SCRIPT } from '../../languages/modes';
import { LANGUAGE_XML } from '../../languages/modes';
import { LANGUAGE_YAML } from '../../languages/modes';
import { WsFile } from '../../modules/wsmodel/WsFile';
import refChange from '../../utils/refChange';
//
// Editor Abstraction Layer
//
import { Editor } from '../../virtual/editor';
import { EditorService } from '../../virtual/editor';
import { EditSession } from '../../virtual/editor';
import { NATIVE_EDITOR_SERVICE_UUID } from '../../services/editor/native-editor.service';

const FIND_REPLACE_COMMAND = {
    name: COMMAND_NAME_FIND,
    bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
    exec: function (editor: Editor) {
        showFindReplace(editor, false);
    },
    readOnly: true // false if this command should not apply in readOnly mode
};

function isTypeScript(path: string): boolean {
    const period = path.lastIndexOf('.');
    if (period >= 0) {
        const extension = path.substring(period + 1);
        switch (extension) {
            case 'ts':
            case 'tsx': {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    console.warn(`isTypeScript('${path}') can't figure that one out.`);
    return false;
}

//
// Choose which editor to inject here. e.g. MONACO_EDITOR_SERVICE_UUID.
// Note, because we are a hybrid application, the WsModel injection must also change.
//
factory.$inject = ['$timeout', EDITOR_PREFERENCES_SERVICE, NATIVE_EDITOR_SERVICE_UUID];
/**
 * Factory for the editor (attribute) directive.
 * This directive turns an HTMLElement into a container for an Editor.
 * The EditSession for the Editor is injected using the ng-model directive.
 * 
 * When changing the parameters to this function, be sure to update the $inject property.
 */
function factory(
    $timeout: ITimeoutService,
    editorPreferencesService: EditorPreferencesService,
    editorService: EditorService): IDirective {

    /**
     * $scope Used to monitor $onDestroy and support transclude.
     * element
     * attrs
     * controllers
     * transclude This parameter will only be set if we set the transclude option to true.
     */
    function link($scope: EditorScope, element: IAugmentedJQuery, attrs: IAttributes, controllers: {}, transclude: ITranscludeFunction) {

        // Maybe these should be constants?
        const systemImports: string[] = ['/jspm_packages/system.js', '/jspm.config.js'];
        const workerImports: string[] = systemImports.concat(TYPESCRIPT_SERVICES_PATH).concat([ACE_WORKER_PATH]);

        const ngModel: INgModelController = controllers[0];
        /**
         * The controller that is a proxy for the workspace.
         */
        const wsController: WorkspaceEditorHost = controllers[1];

        const container: HTMLElement = element[0];
        refChange('start');
        const editor = editorService.createEditor(container);
        /**
         * The function to call that will cause the editor to be removed from the workspace. 
         */
        let removeEditor: (() => void) | undefined;

        const editorPreferencesEventListener = function (event: EditorPreferencesEvent) {
            setTimeout(function () {
                editor.setFontSize(event.fontSize);
                editor.setThemeCss(event.cssClass, event.href);
                editor.setThemeDark(event.isDark);
                editor.setShowFoldWidgets(event.showFoldWidgets);
                editor.setShowGutter(event.showGutter);
                editor.setDisplayIndentGuides(event.displayIndentGuides);
                editor.setShowInvisibles(event.showInvisibles);
                editor.setShowLineNumbers(event.showLineNumbers);
                editor.setShowPrintMargin(event.showPrintMargin);
                editor.setTabSize(event.tabSize);
                editor.setUseSoftTabs(event.useSoftTabs);
            }, 0);
        };
        // This event listener gets removed in onDestroyScope
        editorPreferencesService.addEventListener(currentTheme, editorPreferencesEventListener);

        // Set properties that pertain to rendering.
        // Don't set session attributes here!
        editor.setPadding(4);

        const changeAnnotationHandler = function (data: any, editor: Editor) {
            // Asynchronously trigger Angular digest loop so that files in explorer are updated.
            $scope.$applyAsync(function () {
                // Nothing to see here.
            });
        };

        editor.on('changeAnnotation', changeAnnotationHandler);

        attrs.$observe<boolean>('readonly', function (readOnly: boolean) {
            editor.setReadOnly(readOnly);
        });

        // formatters update the viewValue from the modelValue
        ngModel.$formatters.push(function (modelValue: string) {
            if (isUndefined(modelValue) || modelValue === null) {
                return void 0;
            }
            // We are returning the viewValue. We could make an object literal here.
            // It should then match other usages of $viewValue.
            // We keep it simple by simply returning the string.
            return modelValue;
        });

        // parsers update the modelValue from the viewValue
        // This is how it is done prior to AngularJs 1.3
        ngModel.$parsers.push(function (viewValue: string) {
            ngModel.$setValidity('yadda', true);
            return viewValue;
        });

        // In Angular 1.3+ we have the $validators pipeline.
        // We don't need to set validation states because we have an object, not an array.
        /*
        ngModel.$validators['foo'] = function (modelValue: string, viewValue: string): boolean {
            return true;
        };
        */

        // The basic idea here is to set the $render callback function that will be used to take
        // the model value and use it to update the view (editor).
        ngModel.$render = function () {
            const file: WsFile = ngModel.$viewValue;
            if (file instanceof WsFile) {
                // If there is no a session, then the file should lazily create one.
                const session: EditSession | undefined = file.getSession();
                if (session) {
                    try {
                        // TODO: Crush this code down into an extensible mode-handling and session initializer?
                        // Maybe the WsFile can do some of the work?
                        editor.setSession(session);
                        const undoManager = new UndoManager();
                        editor.setUndoManager(undoManager);
                        editor.addCommand(FIND_REPLACE_COMMAND);
                        editor.addCommand({
                            name: 'Replace',
                            bindKey: { win: 'Ctrl-H', mac: 'Command-H' },
                            exec: function (editor: Editor) {
                                showFindReplace(editor, true);
                            },
                            readOnly: true // false if this command should not apply in readOnly mode
                        });
                        editor.addCommand({
                            name: 'goToNextError',
                            bindKey: { win: 'Alt-E', mac: 'F4' },
                            exec: function (editor: Editor) {
                                showErrorMarker(editor, +1);
                            },
                            scrollIntoView: 'animate',
                            readOnly: true
                        });
                        editor.addCommand({
                            name: 'goToPreviousError',
                            bindKey: { win: 'Alt-Shift-E', mac: 'Shift-F4' },
                            exec: function (editor: Editor) {
                                showErrorMarker(editor, -1);
                            },
                            scrollIntoView: 'animate',
                            readOnly: true
                        });
                        editor.addCommand({
                            name: "showGreekKeyboard",
                            bindKey: { win: "Ctrl-Alt-G", mac: "Command-Alt-G" },
                            exec: function (editor: Editor, line: any) {
                                showGreekKeyboard(editor);
                            }
                        });
                        editor.addCommand({
                            name: "showKeyboardShortcuts",
                            bindKey: { win: "Ctrl-Alt-H", mac: "Command-Alt-H" },
                            exec: function (editor: Editor, line: any) {
                                showKeyboardShortcuts(editor);
                            }
                        });
                        editor.addCommand({
                            name: 'expandSnippet',
                            bindKey: 'Tab',
                            exec: function (editor: Editor) {
                                const success = editor.expandSnippetWithTab({ dryRun: false });
                                if (!success) {
                                    const indentCommand = editor.getCommandByName(COMMAND_NAME_INDENT);
                                    editor.execCommand(indentCommand);
                                }
                            }
                        });
                        editor.addCommand({
                            name: 'formatDocument',
                            bindKey: { win: 'Ctrl-Shift-I', mac: 'Command-Alt-I' },
                            exec: function (editor: Editor) {
                                if (isTypeScript($scope.path)) {
                                    const settings: FormatCodeSettings = {};
                                    settings.baseIndentSize = 0;
                                    settings.convertTabsToSpaces = true;
                                    settings.indentSize = editorPreferencesService.getTabSize();
                                    settings.indentStyle = IndentStyle.Smart;
                                    settings.insertSpaceAfterCommaDelimiter = true;
                                    settings.insertSpaceAfterConstructor = false;
                                    settings.insertSpaceAfterFunctionKeywordForAnonymousFunctions = false;
                                    settings.insertSpaceAfterKeywordsInControlFlowStatements = true;

                                    settings.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces = false;
                                    settings.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces = false;
                                    settings.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets = false;
                                    settings.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis = false;
                                    settings.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces = false;

                                    settings.insertSpaceAfterSemicolonInForStatements = true;
                                    settings.insertSpaceAfterTypeAssertion = true;
                                    settings.insertSpaceBeforeAndAfterBinaryOperators = true;
                                    settings.insertSpaceBeforeFunctionParenthesis = false;
                                    settings.newLineCharacter = '\n';
                                    wsController.getFormattingEditsForDocument($scope.path, settings)
                                        .then(function (textChanges) {
                                            applyTextChanges(textChanges, session);
                                        })
                                        .catch(function (reason) {
                                            // This is rather unlikely, given that our service is running in a thread.
                                            console.warn(`${reason}`);
                                        });
                                }
                            },
                            scrollIntoView: 'animate',
                            readOnly: true
                        });
                        // We must wait for the $render function to be called so that we have a session.
                        switch (file.mode) {
                            case LANGUAGE_HASKELL: {
                                session.setUseWorker(false);
                                session.setLanguageMode(new HaskellMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, <string>file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_PYTHON: {
                                session.setUseWorker(false);
                                session.setLanguageMode(new PythonMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, <string>file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_SCHEME: {
                                // If we don't use the worker then we don't get a confirmation.
                                // session.setUseWorker(false);
                                session.setLanguageMode(new ClojureMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, <string>file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_JAVA_SCRIPT: {
                                session.setLanguageMode(new JavaScriptMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, <string>file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_JSX: {
                                session.setLanguageMode(new JsxMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, <string>file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_TYPE_SCRIPT: {
                                session.setLanguageMode(new TypeScriptMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, <string>file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_TSX: {
                                session.setLanguageMode(new TsxMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, <string>file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_HTML: {
                                session.setLanguageMode(new HtmlMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, <string>file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_JSON: {
                                session.setLanguageMode(new JsonMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, <string>file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_GLSL: {
                                // If we don't use the worker then we don't get a confirmation.
                                session.setLanguageMode(new GlslMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, <string>file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_CSS:
                            case LANGUAGE_LESS: {
                                // If we don't use the worker then we don't get a confirmation.
                                session.setUseWorker(false);
                                session.setLanguageMode(new CssMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, <string>file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_MARKDOWN: {
                                session.setUseWrapMode(true);
                                editor.setWrapBehavioursEnabled(true);
                                session.setLanguageMode(new MarkdownMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, <string>file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_CSV:
                            case LANGUAGE_TEXT: {
                                session.setLanguageMode(new TextMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, <string>file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_XML: {
                                session.setLanguageMode(new XmlMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, <string>file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_YAML: {
                                session.setLanguageMode(new YamlMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, <string>file.mode, editor);
                                });
                                break;
                            }
                            default: {
                                console.warn(`Unrecognized mode => ${file.mode}`);
                            }
                        }
                        $timeout(function () {
                            resizeEditor();
                            // The resize event appears to happen AFTER a session is injected.
                            // If it did not happen that way, the following line would blow up.
                            // TODO: Maybe this should be guarded by an EditSession check in order
                            // to be more fault-tolerant?
                            editor.gotoLine(0, 0);
                        });
                    }
                    finally {
                        session.release();
                    }
                }
                else {
                    console.warn("file did not provide an EditSession.");
                }
            }
            else {
                console.warn(`ng-model in editor directive must be an EditSession: typeof ngModel.$viewValue => '${typeof ngModel.$viewValue}'.`);
            }
        };

        /**
         * Since the default $animate service is adding and removing the
         * ng-hide class in the $$postDigest phase, we need to resize
         * AFTER that happens, which would be in the next
         * tick of the event-loop. We'll use $timeout to do this in the
         * next tick.
         * 
         * This $watch is cancelled on onDestroyScope.
         */
        const unregisterWatchNgShow = $scope.$watch('ngShow'/*attrs['ngShow']*/, function (newShowing: boolean, oldShowing: boolean) {
            if (newShowing) {
                resizeEditorNextTick();
            }
        });

        function resizeEditorNextTick() {
            $timeout(function () { resizeEditor(); }, 0, /* No delay. */ false /* Don't trigger a digest. */);
        }

        function resizeEditor() {
            editor.resize(true);
            editor.updateFull();
        }

        // Both the scope and the element receive '$destroy' events, but the scope is called first.
        // It's probably also the more consistent place to release non-AngularJS resources allocated for the scope.
        function onDestroyScope() {
            unregisterWatchNgShow();
            // TODO: Since we only attach the editor after its thread has started and has been initialized,
            // should we only stop the thread after it has been detached?
            if (editor) {

                editor.off("changeAnnotation", changeAnnotationHandler);

                if (removeEditor) {
                    removeEditor();
                    removeEditor = void 0;
                }
            }
            // Interestingly, there is no $off function, so assume Angular will handle the unhook.
            // editorsController.removeEditor(scope)
            // editor.off('change', onEditorChange);

            editorPreferencesService.removeEventListener(currentTheme, editorPreferencesEventListener);

            // What about stopping the worker?
            if (editor) {
                editor.dispose();
                refChange('stop');
                refChange('dump');
            }
        }

        // We can hook both the scope and the element '$destroy' event.
        // However, the scope event is probably the Best Practice.
        // The scope event also happens before the element event.
        $scope.$on('$destroy', onDestroyScope);
    }

    const directive: IDirective = {
        require: ['ngModel', '^^workspace'],
        // NOTE: Using priority 1 to make sure that this link function (post-link),
        // is executed after the ng-show link function (priority 0 - they are
        // linked in reverse order). That way, the ng-show $watch() bindings are
        // bound first, which means that our $watch() handler will execute after
        // the ng-show $watch() handler.
        priority: 1,
        restrict: 'A',
        scope: {
            path: '@',
            ngShow: '<'
        },
        /**
         * Make the transclude function available in the link functions and manually perform the inclusion because
         * the text node has to go into the editor itself (we don't actually use this feature).
         */
        transclude: false,
        /**
         * The link function is used for DOM manipulation.
         */
        link: link
    };
    return directive;
}

export default factory;
