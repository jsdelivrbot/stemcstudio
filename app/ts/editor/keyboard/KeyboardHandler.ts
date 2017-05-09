import { FUNCTION_KEYS, KEY_MODS } from "../lib/keys";
import keyCodes from "../lib/keys";
import { isMac } from "../lib/useragent";
import { Action } from "./Action";
import { KeyHash } from './KeyHash';
import { Command } from '../commands/Command';
import { KeyboardResponse } from './KeyboardResponse';

/**
 *
 */
export class KeyboardHandler<TARGET> {

    /**
     *
     */
    public commandKeyBinding: { [hashId: number]: { [name: string]: Command<TARGET> } };

    /**
     *
     */
    public commands: { [name: string]: Command<TARGET> };

    /**
     *
     */
    public platform: string;

    /**
     *
     */
    constructor(commands?: Command<TARGET>[], platform?: string) {

        this.platform = platform || (isMac ? "mac" : "win");
        this.commands = {};
        this.commandKeyBinding = {};

        if (commands) {
            this.addCommands(commands);
        }
    }

    /**
     *
     */
    addCommand(command: Command<TARGET>): void {
        if (this.commands[command.name as string]) {
            this.removeCommand(command);
        }

        this.commands[command.name as string] = command;

        if (command.bindKey) {
            this._buildKeyHash(command);
        }
    }

    /**
     *
     */
    removeCommand(command: string | Command<TARGET> /* | { [name: string]: Command }*/, keepCommand = false): void {
        const name = (typeof command === 'string' ? command : command.name) as string;
        command = this.commands[name];
        if (!keepCommand) {
            delete this.commands[name];
        }

        // exhaustive search is brute force but since removeCommand is
        // not a performance critical operation this should be OK
        const ckb = this.commandKeyBinding;
        for (const keyId in ckb) {
            if (ckb.hasOwnProperty(keyId)) {
                // TODO: Is it possible for command to be something other than string or Command?
                // In particular, an array of Commands.
                /*
                const cmdGroup = ckb[keyId];
                if (cmdGroup === command) {
                    delete ckb[keyId];
                }
                */
                for (const key in ckb[keyId]) {
                    if (ckb[keyId][key] === command) {
                        delete ckb[keyId][key];
                    }
                }
            }
        }
    }

    /**
     * Binds key alternatives to an action.
     * This is a convenience function for adding a command, where
     * exec is the action, bindKey and name are the key.
     * The name of the command is derived from the key alternatives string.
     */
    bindKey(key: string, action: Action<TARGET>/*, position*/): void {
        if (!key) {
            throw new TypeError("key must be a string.");
        }
        this.addCommand({ exec: action, bindKey: key, name: key });
    }

    /**
     *
     */
    bindCommand(key: string, command: Command<TARGET>/*, position*/): void {
        // TODO: Do we need to generalize key?
        /*
        if (typeof key === "object" && key) {
            if (position === undefined) {
                position = key.position;
            }
            key = key[this.platform];
        }
        */

        if (!key) {
            return;
        }

        const ckb = this.commandKeyBinding;

        key.split("|").forEach((keyPart) => {
            const binding: KeyHash = this.parseKeys(keyPart);
            const hashId = binding.hashId;
            (ckb[hashId] || (ckb[hashId] = {}))[binding.key] = command;
        });
    }

    /**
     *
     */
    addCommands(commands: Command<TARGET>[]): void {
        for (const command of commands) {
            this.addCommand(command);
        }
    }

    /*
    addBindings(commands: { [name: string]: EditorAction }): void {
  
      commands && Object.keys(commands).forEach((name) => {
  
        const binding: EditorAction = commands[name];
  
        const command: Command = { name: name, exec: binding }
  
        this.addCommand(command);
      });
    }
    */

    /**
     *
     */
    removeCommands(commands: { [name: string]: string | Command<TARGET> }): void {
        Object.keys(commands).forEach((name) => {
            this.removeCommand(commands[name]);
        });
    }

    /**
     *
     */
    bindKeys(keyList: { [name: string]: Action<TARGET> }): void {
        Object.keys(keyList).forEach((key) => {
            this.bindKey(key, keyList[key]);
        });
    }

    /**
     *
     */
    public _buildKeyHash(command: Command<TARGET>): void {
        const binding = command.bindKey;
        if (!binding) {
            return;
        }

        const key = typeof binding === "string" ? binding : binding[this.platform];
        this.bindCommand(key, command);
    }

    /**
     * accepts keys in the form ctrl+Enter or ctrl-Enter
     * keys without modifiers or shift only.
     */
    parseKeys(keys: string): KeyHash {
        // todo support keychains 
        if (keys.indexOf(" ") !== -1) {
            keys = keys.split(/\s+/).pop() as string;
        }

        const parts = keys.toLowerCase().split(/[\-\+]([\-\+])?/).filter(function (x: any) { return x; });
        let key = parts.pop() as string;

        const keyCode = keyCodes[key];
        if (FUNCTION_KEYS[keyCode]) {
            key = FUNCTION_KEYS[keyCode].toLowerCase();
        }
        else if (!parts.length) {
            return { key: key, hashId: -1 };
        }
        else if (parts.length === 1 && parts[0] === "shift") {
            return { key: key.toUpperCase(), hashId: -1 };
        }

        let hashId = 0;
        for (let i = parts.length; i--;) {
            const modifier = KEY_MODS[parts[i]];
            if (modifier === null) {
                throw new Error("invalid modifier " + parts[i] + " in " + keys);
            }
            hashId |= modifier;
        }
        return { key: key, hashId: hashId };
    }

    /**
     *
     */
    findKeyCommand(hashId: number, keyString: string): Command<TARGET> {
        const ckbr = this.commandKeyBinding;
        return ckbr[hashId] && ckbr[hashId][keyString];
    }

    /**
     *
     */
    handleKeyboard(data: any, hashId: number, keyString: string, keyCode?: number, e?: KeyboardEvent): KeyboardResponse<TARGET> {
        const response = {
            command: this.findKeyCommand(hashId, keyString)
        };
        return response;
    }

    /**
     *
     */
    public attach(target: TARGET): void {
        // This implementation does nothing.
    }

    /**
     *
     */
    public detach(target: TARGET): void {
        // This implementation does nothing.
    }
}
