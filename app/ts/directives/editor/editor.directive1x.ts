import { isUndefined } from 'angular';
import { IAttributes, IAugmentedJQuery, IDirective, INgModelController, IQService, ITimeoutService, ITranscludeFunction } from 'angular';
import { applyTextChanges } from './applyTextChanges';
import { ContextMenuItem } from '../contextMenu/ContextMenuItem';
import { COMMAND_NAME_BACKSPACE } from '../../editor/editor_protocol';
import { COMMAND_NAME_DEL } from '../../editor/editor_protocol';
import { COMMAND_NAME_FIND } from '../../editor/editor_protocol';
import { COMMAND_NAME_INSERT_STRING } from '../../editor/editor_protocol';
import { UndoManager } from '../../editor/UndoManager';
import { EditorScope } from './EditorScope';
import { FormatCodeSettings } from '../../editor/workspace/FormatCodeSettings';
import { showErrorMarker } from '../../editor/ext/showErrorMarker';
import { showFindReplace } from '../../editor/ext/showFindReplace';
import { showGreekKeyboard } from '../../extensions/showGreekKeyboard';
import { showKeyboardShortcuts } from '../../editor/ext/showKeyboardShortcuts';
import { EDITOR_PREFERENCES_SERVICE } from '../../modules/editors/constants';
import { EditorPreferencesService } from '../../modules/editors/EditorPreferencesService';
import { EditorPreferencesEvent } from '../../modules/editors/EditorPreferencesEvent';
import { currentTheme } from '../../modules/editors/EditorPreferencesEvent';
import { WorkspaceEditorHost } from '../../directives/editor/WorkspaceEditorHost';
import { WsFile } from '../../modules/wsmodel/WsFile';
// import { refChange } from '../../utils/refChange';
import { computeContextMenu } from './computeContextMenu';
import { renderContextMenu } from '../contextMenu/renderContextMenu';
//
// Format Document
//
import { formatCodeSettings } from '../../workbench/actions/formatDocument';
import { createFormatDocumentCommand } from '../../workbench/commands/formatDocument';
import { TextChange } from '../../editor/workspace/TextChange';
import { Editor } from '../../editor/Editor';
import { EditorService } from '../../editor/EditorService';
import { EditSession } from '../../editor/EditSession';
import { LanguageModeId } from '../../editor/LanguageMode';
import { NATIVE_EDITOR_SERVICE_UUID as EDITOR_SERVICE_UUID } from '../../services/editor/native-editor.service';
import { setLanguage } from './setLanguage';
import { Command } from '../../editor/commands/Command';

const BOGUS_WIDTH = 600;
const BOGUS_HEIGHT = 800;
const BOGUS_HACK = false;

function bindKey(win: string | null, mac: string | null): { win: string | null; mac: string | null } {
    return { win, mac };
}

const BACKSPACE_COMMAND: Command<Editor> = {
    name: COMMAND_NAME_BACKSPACE,
    bindKey: bindKey(
        "Shift-Backspace|Backspace",
        "Ctrl-Backspace|Shift-Backspace|Backspace|Ctrl-H"
    ),
    exec: function (editor: Editor) {
        if (!editor.readOnly) {
            editor.remove("left");
        }
    },
    isAvailable(editor): boolean {
        return !editor.readOnly;
    },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
};

const DELETE_COMMAND: Command<Editor> = {
    name: COMMAND_NAME_DEL,
    bindKey: bindKey("Delete", "Delete|Ctrl-D|Shift-Delete"),
    exec: function (editor: Editor) {
        if (!editor.readOnly) {
            editor.remove("right");
        }
    },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"

};

const FIND_REPLACE_COMMAND: Command<Editor> = {
    name: COMMAND_NAME_FIND,
    bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
    exec: function (editor: Editor) {
        showFindReplace(editor, false);
    },
    readOnly: true // false if this command should not apply in readOnly mode
};

const GOTO_LINE_COMMAND: Command<Editor> = {
    name: "goto Line",
    bindKey: bindKey("Ctrl-L", "Command-L"),
    exec: function (editor: Editor) {
        const response = prompt("Enter line number:");
        if (typeof response === 'string') {
            const line = parseInt(response, 10);
            if (!isNaN(line)) {
                editor.gotoLine(line);
            }
        }
    },
    readOnly: true
};

const UNDO_COMMAND: Command<Editor> = {
    name: "undo",
    bindKey: bindKey("Ctrl-Z", "Command-Z"),
    exec: function (editor: Editor) { editor.undo(); }
};

const REDO_COMMAND: Command<Editor> = {
    name: "redo",
    bindKey: bindKey("Ctrl-Shift-Z|Ctrl-Y", "Command-Shift-Z|Command-Y"),
    exec: function (editor: Editor) { editor.redo(); }
};

const NAVIGATE_UP_COMMAND: Command<Editor> = {
    name: "goto Line Up",
    bindKey: bindKey("Up", "Up|Ctrl-P"),
    exec: function (editor: Editor, args: { times: number }) { editor.navigateUp(args.times); },
    multiSelectAction: "forEach",
    readOnly: true
};

const NAVIGATE_DOWN_COMMAND: Command<Editor> = {
    name: "goto Line Down",
    bindKey: bindKey("Down", "Down|Ctrl-N"),
    exec: function (editor: Editor, args: { times: number }) { editor.navigateDown(args.times); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
};

const NAVIGATE_LEFT_COMMAND: Command<Editor> = {
    name: "goto Left",
    bindKey: bindKey("Left", "Left|Ctrl-B"),
    exec: function (editor: Editor, args: { times: number }) { editor.navigateLeft(args.times); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
};

const NAVIGATE_RIGHT_COMMAND: Command<Editor> = {
    name: "goto Right",
    bindKey: bindKey("Right", "Right|Ctrl-F"),
    exec: function (editor: Editor, args: { times: number }) { editor.navigateRight(args.times); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
};

/**
 * Provides support for inserting the text typed by the user.
 * Inserts text into wherever the cursor is pointing.
 */
const TEXT_INSERT_COMMAND: Command<Editor> = {
    name: COMMAND_NAME_INSERT_STRING,
    exec: function (editor: Editor, text: string) { editor.insert(text); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
};

const GOTO_LINE_START: Command<Editor> = {
    name: "goto Line Start",
    bindKey: bindKey("Alt-Left|Home", "Command-Left|Home|Ctrl-A"),
    exec: function (editor: Editor) { editor.navigateLineStart(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
};

const GOTO_FILE_START: Command<Editor> = {
    name: "goto File Start",
    bindKey: bindKey("Ctrl-Home", "Command-Home|Command-Up"),
    exec: function (editor: Editor) { editor.navigateFileStart(); },
    multiSelectAction: "forEach",
    readOnly: true,
    scrollIntoView: "animate",
    group: "fileJump"
};

const GOTO_LINE_END: Command<Editor> = {
    name: "goto Line End",
    bindKey: bindKey("Alt-Right|End", "Command-Right|End|Ctrl-E"),
    exec: function (editor: Editor) { editor.navigateLineEnd(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
};

const GOTO_FILE_END: Command<Editor> = {
    name: "goto File End",
    bindKey: bindKey("Ctrl-End", "Command-End|Command-Down"),
    exec: function (editor: Editor) { editor.navigateFileEnd(); },
    multiSelectAction: "forEach",
    readOnly: true,
    scrollIntoView: "animate",
    group: "fileJump"
};

const OVERWRITE: Command<Editor> = {
    name: "toggle Overwrite",
    bindKey: bindKey("Insert", "Insert"),
    exec: function (editor: Editor) { editor.toggleOverwrite(); },
    readOnly: true
};

const GOTO_PAGE_DOWN: Command<Editor> = {
    name: "goto Page Down",
    bindKey: bindKey("PageDown", "PageDown|Ctrl-V"),
    exec: function (editor: Editor) { editor.gotoPageDown(); },
    readOnly: true
};

const GOTO_PAGE_UP: Command<Editor> = {
    name: "goto Page Up",
    bindKey: "PageUp",
    exec: function (editor: Editor) { editor.gotoPageUp(); },
    readOnly: true
};

const SELECT_PAGE_DOWN: Command<Editor> = {
    name: "select Page Down",
    bindKey: "Shift-PageDown",
    exec: function (editor: Editor) { editor.selectPageDown(); },
    readOnly: true
};

const SELECT_PAGE_UP: Command<Editor> = {
    name: "select Page Up",
    bindKey: "Shift-PageUp",
    exec: function (editor: Editor) { editor.selectPageUp(); },
    readOnly: true
};

const SELECT_DOWN: Command<Editor> = {
    name: "select Down",
    bindKey: bindKey("Shift-Down", "Shift-Down|Ctrl-Shift-N"),
    exec: function (editor: Editor) { editor.selectDown(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
};

const SELECT_UP: Command<Editor> = {
    name: "select Up",
    bindKey: bindKey("Shift-Up", "Shift-Up|Ctrl-Shift-P"),
    exec: function (editor: Editor) { editor.selectUp(); },
    multiSelectAction: "forEach",
    readOnly: true
};

const SELECT_LEFT: Command<Editor> = {
    name: "select Left",
    bindKey: bindKey("Shift-Left", "Shift-Left|Ctrl-Shift-B"),
    exec: function (editor: Editor) { editor.selectLeft(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
};

const SELECT_RIGHT: Command<Editor> = {
    name: "select Right",
    bindKey: bindKey("Shift-Right", "Shift-Right"),
    exec: function (editor: Editor) { editor.selectRight(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
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
        // refChange('start');
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
                const session = file.getSession();
                if (session) {
                    try {
                        // TODO: Crush this code down into an extensible mode-handling and session initializer?
                        // Maybe the WsFile can do some of the work?
                        editor.setSession(session);
                        const undoManager = new UndoManager();
                        editor.setUndoManager(undoManager);
                        addCommands($scope.path, editor, session, wsController, editorPreferencesService);

                        // We must wait for the $render function to be called so that we have a session.
                        const mode = file.mode;
                        const path = $scope.path;
                        if (mode) {
                            setLanguage(session, mode as LanguageModeId)
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
                // refChange('stop');
                // refChange('dump');
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

    editor.addCommand(TEXT_INSERT_COMMAND);

    editor.addCommand(BACKSPACE_COMMAND);
    editor.addCommand(DELETE_COMMAND);

    editor.addCommand(FIND_REPLACE_COMMAND);
    editor.addCommand(GOTO_LINE_COMMAND);

    editor.addCommand(UNDO_COMMAND);
    editor.addCommand(REDO_COMMAND);

    editor.addCommand(NAVIGATE_DOWN_COMMAND);
    editor.addCommand(NAVIGATE_UP_COMMAND);
    editor.addCommand(NAVIGATE_LEFT_COMMAND);
    editor.addCommand(NAVIGATE_RIGHT_COMMAND);

    editor.addCommand(GOTO_LINE_START);
    editor.addCommand(GOTO_FILE_START);

    editor.addCommand(GOTO_LINE_END);
    editor.addCommand(GOTO_FILE_END);

    editor.addCommand(GOTO_PAGE_DOWN);
    editor.addCommand(GOTO_PAGE_UP);

    editor.addCommand(SELECT_PAGE_DOWN);
    editor.addCommand(SELECT_PAGE_UP);

    editor.addCommand(SELECT_DOWN);
    editor.addCommand(SELECT_UP);
    editor.addCommand(SELECT_LEFT);
    editor.addCommand(SELECT_RIGHT);

    editor.addCommand(OVERWRITE);

    editor.addCommand({
        name: 'replace',
        bindKey: { win: 'Ctrl-H', mac: 'Command-H' },
        exec: function () {
            showFindReplace(editor, true);
        },
        readOnly: true // false if this command should not apply in readOnly mode
    });
    editor.addCommand({
        name: 'goto Next Error',
        bindKey: { win: 'Alt-E', mac: 'F4' },
        exec: function () {
            showErrorMarker(editor, +1);
        },
        scrollIntoView: 'animate',
        readOnly: true
    });
    editor.addCommand({
        name: 'goto Previous Error',
        bindKey: { win: 'Alt-Shift-E', mac: 'Shift-F4' },
        exec: function () {
            showErrorMarker(editor, -1);
        },
        scrollIntoView: 'animate',
        readOnly: true
    });
    editor.addCommand({
        name: "show Greek Keyboard",
        bindKey: { win: "Ctrl-Alt-G", mac: "Command-Alt-G" },
        exec: function () {
            showGreekKeyboard(editor);
        }
    });
    editor.addCommand({
        name: "show Keyboard Shortcuts",
        bindKey: { win: "Ctrl-Alt-H", mac: "Command-Alt-H" },
        exec: function () {
            showKeyboardShortcuts(editor);
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
