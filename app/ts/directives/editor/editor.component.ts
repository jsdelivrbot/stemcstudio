import * as ng from 'angular';
import applyTextChanges from './applyTextChanges';
import ClojureMode from '../../editor/mode/ClojureMode';
import CssMode from '../../editor/mode/CssMode';
import GlslMode from '../../editor/mode/GlslMode';
import HaskellMode from '../../editor/mode/HaskellMode';
import HtmlMode from '../../editor/mode/HtmlMode';
import JavaScriptMode from '../../editor/mode/JavaScriptMode';
import JsonMode from '../../editor/mode/JsonMode';
import MarkdownMode from '../../editor/mode/MarkdownMode';
import PythonMode from '../../editor/mode/PythonMode';
import TextMode from '../../editor/mode/TextMode';
import TypeScriptMode from '../../editor/mode/TypeScriptMode';
import XmlMode from '../../editor/mode/XmlMode';
import EditSession from '../../editor/EditSession';
import Renderer from '../../editor/Renderer';
import UndoManager from '../../editor/UndoManager';
import Editor from '../../editor/Editor';
import EditorScope from './EditorScope';
import FormatCodeSettings from '../../editor/workspace/FormatCodeSettings';
import IndentStyle from '../../editor/workspace/IndentStyle';
import showErrorMarker from '../../editor/ext/showErrorMarker';
import showFindReplace from '../../editor/ext/showFindReplace';
import showKeyboardShortcuts from '../../editor/ext/showKeyboardShortcuts';
import ISettingsService from '../../services/settings/ISettingsService';
import TextChange from '../../editor/workspace/TextChange';
import ITextService from '../../services/text/ITextService';
import { EDITOR_PREFERENCES_SERVICE } from '../../modules/editors/constants';
import EditorPreferencesService from '../../modules/editors/EditorPreferencesService';
import EditorPreferencesEvent from '../../modules/editors/EditorPreferencesEvent';
import { currentTheme } from '../../modules/editors/EditorPreferencesEvent';
import WorkspaceMixin from '../../directives/editor/WorkspaceMixin';
import { LANGUAGE_CSS } from '../../languages/modes';
import { LANGUAGE_CSV } from '../../languages/modes';
import { LANGUAGE_GLSL } from '../../languages/modes';
import { LANGUAGE_HASKELL } from '../../languages/modes';
import { LANGUAGE_HTML } from '../../languages/modes';
import { LANGUAGE_JAVA_SCRIPT } from '../../languages/modes';
import { LANGUAGE_JSON } from '../../languages/modes';
import { LANGUAGE_LESS } from '../../languages/modes';
import { LANGUAGE_MARKDOWN } from '../../languages/modes';
import { LANGUAGE_SCHEME } from '../../languages/modes';
import { LANGUAGE_PYTHON } from '../../languages/modes';
import { LANGUAGE_TYPE_SCRIPT } from '../../languages/modes';
import { LANGUAGE_TEXT } from '../../languages/modes';
import { LANGUAGE_XML } from '../../languages/modes';
import WsFile from '../../wsmodel/services/WsFile';

function isTypeScript(path: string): boolean {
    const period = path.lastIndexOf('.');
    if (period >= 0) {
        const extension = path.substring(period + 1);
        switch (extension) {
            case 'ts': {
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

/**
 * Factory for the editor (attribute) directive.
 * This directive turns an HTMLElement into a container for an Editor.
 * The EditSession for the Editor is injected using the ng-model directive.
 * 
 * When changing the parameters to this function, be sure to update the $inject property.
 */
function factory(
    $timeout: ng.ITimeoutService,
    settings: ISettingsService,
    textService: ITextService,
    editorPreferencesService: EditorPreferencesService): ng.IDirective {

    /**
     * @param $scope Used to monitor $onDestroy and support transclude.
     * @param element
     * @param attrs
     * @param controllers
     * @param transclude This parameter will only be set if we set the transclude option to true.
     */
    function link($scope: EditorScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controllers: {}, transclude: ng.ITranscludeFunction) {

        // Maybe these should be constants?
        const systemImports: string[] = ['/jspm_packages/system.js', '/jspm.config.js'];
        const workerImports: string[] = systemImports.concat(['/js/ace-workers.js']);

        const ngModel: ng.INgModelController = controllers[0];
        /**
         * The controller that is a proxy for the workspace.
         */
        const wsController: WorkspaceMixin = controllers[1];

        const container: HTMLElement = element[0];
        const renderer: Renderer = new Renderer(container);
        const editor: Editor = new Editor(renderer, void 0);
        /**
         * The function to call that will cause the editor to be removed from the workspace. 
         */
        let removeEditor: () => void;

        const editorPreferencesEventListener = function (event: EditorPreferencesEvent) {
            setTimeout(function () {
                editor.setFontSize(event.fontSize);
                editor.setThemeCss(event.cssClass, event.href);
                editor.setThemeDark(event.isDark);
                editor.setShowFoldWidgets(event.showFoldWidgets);
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
            if (ng.isUndefined(modelValue) || modelValue === null) {
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
                const session: EditSession = file.getSession();
                if (session) {
                    try {
                        // TODO: Crush this code down into an extensible mode-handling and session initializer?
                        // Maybe the WsFile can do some of the work?
                        editor.setSession(session);
                        const undoManager = new UndoManager();
                        session.setUndoManager(undoManager);
                        editor.commands.addCommand({
                            name: 'Find',
                            bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
                            exec: function (editor: Editor) {
                                showFindReplace(editor, false);
                            },
                            readOnly: true // false if this command should not apply in readOnly mode
                        });
                        editor.commands.addCommand({
                            name: 'Replace',
                            bindKey: { win: 'Ctrl-H', mac: 'Command-H' },
                            exec: function (editor: Editor) {
                                showFindReplace(editor, true);
                            },
                            readOnly: true // false if this command should not apply in readOnly mode
                        });
                        editor.commands.addCommand({
                            name: 'goToNextError',
                            bindKey: { win: 'Alt-E', mac: 'F4' },
                            exec: function (editor: Editor) {
                                showErrorMarker(editor, +1);
                            },
                            scrollIntoView: 'animate',
                            readOnly: true
                        });
                        editor.commands.addCommand({
                            name: 'goToPreviousError',
                            bindKey: { win: 'Alt-Shift-E', mac: 'Shift-F4' },
                            exec: function (editor: Editor) {
                                showErrorMarker(editor, -1);
                            },
                            scrollIntoView: 'animate',
                            readOnly: true
                        });
                        editor.commands.addCommands([{
                            name: "showKeyboardShortcuts",
                            bindKey: { win: "Ctrl-Alt-H", mac: "Command-Alt-H" },
                            exec: function (editor: Editor, line: any) {
                                showKeyboardShortcuts(editor);
                            }
                        }]);
                        editor.commands.addCommand({
                            name: 'formatDocument',
                            bindKey: { win: 'Ctrl-Shift-I', mac: 'Command-Alt-I' },
                            exec: function (editor: Editor) {
                                if (isTypeScript($scope.path)) {
                                    const settings: FormatCodeSettings = {};
                                    settings.baseIndentSize = 0;
                                    settings.convertTabsToSpaces = editorPreferencesService.getUseSoftTabs();
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
                                    wsController.getFormattingEditsForDocument($scope.path, settings, function (err: any, textChanges: TextChange[]) {
                                        if (!err) {
                                            applyTextChanges(textChanges, session);
                                        }
                                        else {
                                            console.warn(`${err}`);
                                        }
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
                                    removeEditor = wsController.attachEditor($scope.path, file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_PYTHON: {
                                session.setUseWorker(false);
                                session.setLanguageMode(new PythonMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, file.mode, editor);
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
                                    removeEditor = wsController.attachEditor($scope.path, file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_JAVA_SCRIPT: {
                                session.setLanguageMode(new JavaScriptMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_TYPE_SCRIPT: {
                                session.setLanguageMode(new TypeScriptMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_HTML: {
                                session.setLanguageMode(new HtmlMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_JSON: {
                                session.setLanguageMode(new JsonMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_GLSL: {
                                // If we don't use the worker then we don't get a confirmation.
                                session.setLanguageMode(new GlslMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, file.mode, editor);
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
                                    removeEditor = wsController.attachEditor($scope.path, file.mode, editor);
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
                                    removeEditor = wsController.attachEditor($scope.path, file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_CSV:
                            case LANGUAGE_TEXT: {
                                session.setLanguageMode(new TextMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, file.mode, editor);
                                });
                                break;
                            }
                            case LANGUAGE_XML: {
                                session.setLanguageMode(new XmlMode('/js/worker.js', workerImports), function (err: any) {
                                    if (err) {
                                        console.warn(`${file.mode} => ${err}`);
                                    }
                                    removeEditor = wsController.attachEditor($scope.path, file.mode, editor);
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
            editor.renderer.updateFull();
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
            }
        }

        // We can hook both the scope and the element '$destroy' event.
        // However, the scope event is probably the Best Practice.
        // The scope event also happens before the element event.
        $scope.$on('$destroy', onDestroyScope);
    }

    const directive: ng.IDirective = {
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

factory.$inject = ['$timeout', 'settings', 'textService', EDITOR_PREFERENCES_SERVICE];

export default factory;
