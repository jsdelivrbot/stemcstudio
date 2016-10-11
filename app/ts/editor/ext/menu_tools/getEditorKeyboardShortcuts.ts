import Command from '../../commands/Command';
import Editor from '../../Editor';
import {KEY_MODS} from '../../lib/keys';
/**
 * Gets a map of keyboard shortcuts to command names for the current platform.
 */

/**
 * Gets a map of keyboard shortcuts to command names for the current platform.
 * @param {ace.Editor} editor An editor instance.
 * @returns {Array} Returns an array of objects representing the keyboard
 *  shortcuts for the given editor.
 * @example
 * var getKbShortcuts = require('./get_keyboard_shortcuts');
 * console.lg(getKbShortcuts(editor));
 * // [
 * //     {'command' : aCommand, 'key' : 'Control-d'},
 * //     {'command' : aCommand, 'key' : 'Control-d'}
 * // ]
 */
export interface KeyboardShortcut {
    command: string;
    key: string;
}

interface CommandMap { [name: string]: KeyboardShortcut; }

export default function getEditorKeyboardShortcuts(editor: Editor): KeyboardShortcut[] {
    const keybindings: KeyboardShortcut[] = [];
    const commandMap: CommandMap = {};
    editor.keyBinding.$handlers.forEach(function (handler) {
        const ckb = handler.commandKeyBinding;
        for (let hashString in ckb) {
            if (ckb.hasOwnProperty(hashString)) {
                const hashId = parseInt(hashString, 10);
                let modString: string;
                if (hashId === -1) {
                    modString = "";
                }
                else if (isNaN(hashId)) {
                    modString = hashString;
                }
                else {
                    modString = "" +
                        (hashId & KEY_MODS.command ? "Cmd-" : "") +
                        (hashId & KEY_MODS.ctrl ? "Ctrl-" : "") +
                        (hashId & KEY_MODS.alt ? "Alt-" : "") +
                        (hashId & KEY_MODS.shift ? "Shift-" : "");
                }
                const commands = ckb[hashString];
                for (let key in commands) {
                    if (commands.hasOwnProperty(key)) {
                        const command: Command = commands[key];
                        if (commandMap[command.name]) {
                            commandMap[command.name].key += "|" + modString + key;
                        }
                        else {
                            commandMap[command.name] = { key: modString + key, command: command.name };
                            keybindings.push(commandMap[command.name]);
                        }
                    }
                }
            }
        }
    });
    return keybindings;
};
