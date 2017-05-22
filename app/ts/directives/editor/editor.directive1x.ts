import { isUndefined } from 'angular';
import { IAttributes, IAugmentedJQuery, IDirective, INgModelController, IQService, ITimeoutService, ITranscludeFunction } from 'angular';
import { applyTextChanges } from './applyTextChanges';
import { ContextMenuItem } from '../contextMenu/ContextMenuItem';
import { COMMAND_NAME_FIND } from '../../editor/editor_protocol';
import { COMMAND_NAME_INDENT } from '../../editor/editor_protocol';
import UndoManager from '../../editor/UndoManager';
import { EditorScope } from './EditorScope';
import { FormatCodeSettings } from '../../editor/workspace/FormatCodeSettings';
import { showErrorMarker } from '../../editor/ext/showErrorMarker';
import { showFindReplace } from '../../editor/ext/showFindReplace';
import { showGreekKeyboard } from '../../editor/ext/showGreekKeyboard';
import { showKeyboardShortcuts } from '../../editor/ext/showKeyboardShortcuts';
import { EDITOR_PREFERENCES_SERVICE } from '../../modules/editors/constants';
import { EditorPreferencesService } from '../../modules/editors/EditorPreferencesService';
import { EditorPreferencesEvent } from '../../modules/editors/EditorPreferencesEvent';
import { currentTheme } from '../../modules/editors/EditorPreferencesEvent';
import { WorkspaceEditorHost } from '../../directives/editor/WorkspaceEditorHost';
import { WsFile } from '../../modules/wsmodel/WsFile';
import refChange from '../../utils/refChange';
import { computeContextMenu } from './computeContextMenu';
import { renderContextMenu } from '../contextMenu/renderContextMenu';
//
// Format Document
//
import { formatCodeSettings } from '../../workbench/actions/formatDocument';
import { createFormatDocumentCommand } from '../../workbench/commands/formatDocument';
import { TextChange } from '../../editor/workspace/TextChange';

//
// Editor Abstraction Layer
//
import { Editor } from '../../virtual/editor';
// import { EditorMinimal } from '../../virtual/EditorMinimal';
import { EditorMaximal } from '../../virtual/EditorMaximal';
import { /*EditorCommandable,*/ isEditorCommandable } from '../../virtual/EditorCommandable';
import { isEditorConfigurable } from '../../virtual/EditorConfigurable';
import { isEditorFocusable } from '../../virtual/EditorFocusable';
import { EditorSearchable, isEditorSearchable } from '../../virtual/EditorSearchable';
import { isEditorUndoable } from '../../virtual/EditorUndoable';
import { EditorService } from '../../virtual/editor';
import { EditSession } from '../../virtual/editor';
import { LanguageModeId } from '../../virtual/editor';
//
// Choose EditorService implementation (AngularJS).
// See also WsModel for Angular.
//
// import { MONACO_EDITOR_SERVICE_UUID as EDITOR_SERVICE_UUID } from '../../services/editor/monaco-editor.service';
import { NATIVE_EDITOR_SERVICE_UUID as EDITOR_SERVICE_UUID } from '../../services/editor/native-editor.service';

const BOGUS_WIDTH = 600;
const BOGUS_HEIGHT = 800;
const BOGUS_HACK = false;

const FIND_REPLACE_COMMAND = {
    name: COMMAND_NAME_FIND,
    bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
    exec: function (editor: EditorSearchable) {
        showFindReplace(editor, false);
    },
    readOnly: true // false if this command should not apply in readOnly mode
};

interface EditorDetacher {
    (): void;
}

//
// Choose which editor to inject here. e.g. MONACO_EDITOR_SERVICE_UUID.
// Note, because we are a hybrid application, the WsModel injection must also change.
//
createEditorDirective.$inject = ['$q', '$timeout', EDITOR_PREFERENCES_SERVICE, EDITOR_SERVICE_UUID, 'FEATURE_EDITOR_CONTEXT_MENU'];
/**
 * Factory for the editor (attribute) directive.
 * This directive turns an HTMLElement into a container for an Editor.
 * The EditSession for the Editor is injected using the ng-model directive.
 * 
 * When changing the parameters to this function, be sure to update the $inject property.
 */
export function createEditorDirective(
    $q: IQService,
    $timeout: ITimeoutService,
    editorPreferencesService: EditorPreferencesService,
    editorService: EditorService,
    FEATURE_EDITOR_CONTEXT_MENU: boolean): IDirective {

    /**
     * $scope Used to monitor $onDestroy and support transclude.
     * element
     * attrs
     * controllers
     * transclude This parameter will only be set if we set the transclude option to true.
     */
    function link($scope: EditorScope, element: IAugmentedJQuery, attrs: IAttributes, controllers: {}, transclude: ITranscludeFunction): void {

        const ngModel: INgModelController = controllers[0];
        /**
         * The controller that is a proxy for the workspace.
         */
        const wsController: WorkspaceEditorHost = controllers[1];

        const container: HTMLElement = element[0];
        refChange('start');
        //
        // We create the Editor UI component first then inject the EditSession later through the HTML property.
        //
        const editor = editorService.createEditor(container);
        /**
         * The function to call that will cause the editor to be removed from the workspace.
         * Notice that this variable is established asynchronously because we wait until a
         * language mode (worker thread) has been established.
         */
        let removeEditor: EditorDetacher | undefined;

        const editorPreferencesEventListener = function (event: EditorPreferencesEvent) {
            if (isEditorConfigurable(editor)) {
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
            }
        };
        // This event listener gets removed in onDestroyScope
        editorPreferencesService.addEventListener(currentTheme, editorPreferencesEventListener);

        // Set properties that pertain to rendering.
        // Don't set session attributes here!
        editor.setPadding(4);

        const changeAnnotationHandler = function (data: any, editor: EditorMaximal) {
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
                const session = file.getSession();
                if (session) {
                    try {
                        // TODO: Crush this code down into an extensible mode-handling and session initializer?
                        // Maybe the WsFile can do some of the work?
                        editor.setSession(session);
                        if (isEditorUndoable(editor)) {
                            const undoManager = new UndoManager();
                            editor.setUndoManager(undoManager);
                        }
                        if (isEditorCommandable(editor)) {
                            addCommands($scope.path, editor, session, wsController, editorPreferencesService);
                        }

                        // We must wait for the $render function to be called so that we have a session.
                        const mode = file.mode;
                        const path = $scope.path;
                        if (mode) {
                            session.setLanguage(mode as LanguageModeId)
                                .then(function () {
                                    // TODO: Some modes need further editor configuration.
                                    // See the setLanguage method for comments.
                                    removeEditor = wsController.attachEditor(path, mode, editor);
                                })
                                .catch(function (err) {
                                    console.warn(`Unable to set language for path '${path}' with mode ${mode}.`);
                                });
                        }
                        else {
                            console.warn(`Unable to call session.setLanguage for path '${path}'. The mode property is ${typeof mode}`);
                        }

                        // Almost ready to go. Resize the editor and put the cursor at the beginning.
                        // TODO: If we want to remember the lineNumber and column then these would be
                        // properties passed in through the scope (or the controller).
                        $timeout(function () {
                            resizeEditor(BOGUS_WIDTH, BOGUS_HEIGHT);
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

        /**
         * Our mutable state includes the currently displayed context menu.
         */
        let currentContextMenu: IAugmentedJQuery | undefined = void 0;

        /**
         * 
         */
        function removeContextMenu() {
            if (currentContextMenu) {
                currentContextMenu.remove();
                currentContextMenu = void 0;
            }
        }

        const contextMenuHandler = function (contextMenuEvent: PointerEvent) {
            const indentSize = editorPreferencesService.getTabSize();
            const file: WsFile = ngModel.$viewValue;
            const session = file.getSession();
            const menu: (ContextMenuItem | null)[] = computeContextMenu($scope.path, editor, indentSize, {
                getFormattingEditsForDocument() {
                    const settings = formatCodeSettings(indentSize);
                    return wsController.getFormattingEditsForDocument($scope.path, settings);
                },
                applyTextChanges(edits: TextChange<number>[], session: EditSession) {
                    applyTextChanges(edits, session);
                }
            }, session);
            if (menu instanceof Array) {
                if (menu.length > 0) {
                    contextMenuEvent.stopPropagation();
                    $scope.$apply(function () {
                        contextMenuEvent.preventDefault();
                        currentContextMenu = renderContextMenu($q, $scope, contextMenuEvent, menu, removeContextMenu);
                    });
                }
            }
            else {
                const msg = "context-menu expression must evaluate to an array.";
                console.warn(msg);
            }
        };

        if (FEATURE_EDITOR_CONTEXT_MENU) {
            container.addEventListener('contextmenu', contextMenuHandler, false);
        }

        function resizeEditorNextTick() {
            $timeout(function () { resizeEditor(BOGUS_WIDTH, BOGUS_HEIGHT); }, 0, /* No delay. */ false /* Don't trigger a digest. */);
        }

        function resizeEditor(w: number, h: number) {
            // The following two lines are a temporary hack for Monaco.
            if (BOGUS_HACK) {
                container.style.width = w + 'px';
                container.style.height = h + 'px';
            }
            editor.resize(true);
            editor.updateFull();
        }

        // Both the scope and the element receive '$destroy' events, but the scope is called first.
        // It's probably also the more consistent place to release non-AngularJS resources allocated for the scope.
        function onDestroyScope() {

            if (FEATURE_EDITOR_CONTEXT_MENU) {
                container.removeEventListener('contextmenu', contextMenuHandler, false);
            }

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

/**
 * TODO: The directive should not be able to add commands that the editor cannot fulfil.
 */
function addCommands(path: string, editor: Editor, session: EditSession, wsController: WorkspaceEditorHost, editorPreferencesService: EditorPreferencesService): void {
    if (isEditorSearchable(editor)) {
        editor.addCommand(FIND_REPLACE_COMMAND);
        editor.addCommand({
            name: 'Replace',
            bindKey: { win: 'Ctrl-H', mac: 'Command-H' },
            exec: function () {
                showFindReplace(editor, true);
            },
            readOnly: true // false if this command should not apply in readOnly mode
        });
    }
    editor.addCommand({
        name: 'goToNextError',
        bindKey: { win: 'Alt-E', mac: 'F4' },
        exec: function () {
            showErrorMarker(editor, +1);
        },
        scrollIntoView: 'animate',
        readOnly: true
    });
    editor.addCommand({
        name: 'goToPreviousError',
        bindKey: { win: 'Alt-Shift-E', mac: 'Shift-F4' },
        exec: function () {
            showErrorMarker(editor, -1);
        },
        scrollIntoView: 'animate',
        readOnly: true
    });
    if (isEditorFocusable(editor)) {
        editor.addCommand({
            name: "showGreekKeyboard",
            bindKey: { win: "Ctrl-Alt-G", mac: "Command-Alt-G" },
            exec: function () {
                showGreekKeyboard(editor);
            }
        });
    }
    editor.addCommand({
        name: "showKeyboardShortcuts",
        bindKey: { win: "Ctrl-Alt-H", mac: "Command-Alt-H" },
        exec: function () {
            showKeyboardShortcuts(editor);
        }
    });
    editor.addCommand({
        name: 'expandSnippet',
        bindKey: 'Tab',
        exec: function () {
            const success = editor.expandSnippetWithTab({ dryRun: false });
            if (!success) {
                const indentCommand = editor.getCommandByName(COMMAND_NAME_INDENT);
                editor.execCommand(indentCommand);
            }
        }
    });
    // Format Document
    // TODO: If the file gets renamed
    editor.addCommand(createFormatDocumentCommand(path, editorPreferencesService.getTabSize(), {
        getFormattingEditsForDocument(path: string, settings: FormatCodeSettings) {
            return wsController.getFormattingEditsForDocument(path, settings);
        },
        applyTextChanges(textChanges: TextChange<number>[]) {
            applyTextChanges(textChanges, session);
        }
    }, session));
}
