import Editor from '../Editor';
import {KeyboardShortcut} from '../ext/menu_tools/getEditorKeyboardShortcuts';
import getEditorKeyboardShortcuts from '../ext/menu_tools/getEditorKeyboardShortcuts';
import overlayPage from '../ext/menu_tools/overlayPage';

export default function showKeyboardShortcuts(editor: Editor) {
    // make sure the menu isn't open already.
    if (!document.getElementById('kbshortcutmenu')) {
        const kb = getEditorKeyboardShortcuts(editor);
        kb.sort(function (a: KeyboardShortcut, b: KeyboardShortcut) {
            return a.command.toLowerCase() > b.command.toLowerCase() ? +1 : -1;
        });
        const el = document.createElement('div');
        const commands = kb.reduce(function (previous, current) {
            return previous + '<div class="ace_optionsMenuEntry"><span class="ace_optionsMenuCommand">'
                + current.command + '</span> : '
                + '<span class="ace_optionsMenuKey">' + current.key + '</span></div>';
        }, '');

        el.id = 'kbshortcutmenu';
        el.innerHTML = '<h1>Keyboard Shortcuts</h1>' + commands + '</div>';
        overlayPage(editor, el, '0', '0', '0', null);
    }
};
/*
editor.commands.addCommands([{
    name: "showKeyboardShortcuts",
    bindKey: { win: "Ctrl-Alt-h", mac: "Command-Alt-h" },
    exec: function (editor, line) {
        editor.showKeyboardShortcuts();
    }
}]);
*/
