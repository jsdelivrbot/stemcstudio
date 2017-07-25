import { KeyboardShortcut } from '../ext/menu_tools/getEditorKeyboardShortcuts';
import { getEditorKeyboardShortcuts } from '../ext/menu_tools/getEditorKeyboardShortcuts';
import { overlayPage } from '../ext/menu_tools/overlayPage';
import { Editor } from '../../editor/Editor';

const ID_CONTENT_ELEMENT = 'kbshortcutmenu';

/**
 * Shows a Keyboard Shortcuts" using an overlay page.
 * The keyboard shortcuts are specific to the editor.
 * The shortcuts are sorted in lowercase.
 */
export function showKeyboardShortcuts(editor: Editor) {
    // make sure the menu isn't open already.
    if (!document.getElementById(ID_CONTENT_ELEMENT)) {
        const kb = getEditorKeyboardShortcuts(editor);
        kb.sort(function (a: KeyboardShortcut, b: KeyboardShortcut) {
            return a.command.toLowerCase() > b.command.toLowerCase() ? +1 : -1;
        });
        const contentElement = document.createElement('div');
        const commands = kb.reduce(function (previous: string, current: KeyboardShortcut) {
            return previous + '<div class="ace_optionsMenuEntry"><span class="ace_optionsMenuCommand">'
                + current.command + '</span> : '
                + '<span class="ace_optionsMenuKey">' + current.key + '</span></div>';
        }, '');

        contentElement.id = ID_CONTENT_ELEMENT;
        contentElement.innerHTML = '<h1>Keyboard Shortcuts</h1>' + commands + '</div>';
        overlayPage(editor, contentElement, '0', '0', '0', null, function () {
            // No cleanup required.
        });
    }
}
