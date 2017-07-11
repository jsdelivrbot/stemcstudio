import { Editor } from '../../../editor/Editor';
import { KEY_MODS } from '../../lib/keys';
/**
 * Gets a map of keyboard shortcuts to command names for the current platform.
 */

export interface KeyboardShortcut {
    command: string;
    key: string;
}

interface CommandMap { [name: string]: KeyboardShortcut; }

export function getEditorKeyboardShortcuts(editor: Editor): KeyboardShortcut[] {
    const keybindings: KeyboardShortcut[] = [];
    const commandMap: CommandMap = {};
    editor.getKeyboardHandlers().forEach(function (handler) {
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
                        const command = commands[key];
                        const available = typeof command.isAvailable === 'function' ? command.isAvailable(editor) : true;
                        if (available) {
                            if (commandMap[command.name as string]) {
                                commandMap[command.name as string].key += "|" + modString + key;
                            }
                            else {
                                commandMap[command.name as string] = { key: modString + key, command: command.name as string };
                                keybindings.push(commandMap[command.name as string]);
                            }
                        }
                    }
                }
            }
        }
    });
    return keybindings;
}
