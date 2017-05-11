import { isMac } from "../lib/useragent";
import { Action } from "./Action";
import { KeyHash } from './KeyHash';
import { Command } from '../commands/Command';
import { KeyboardResponse } from './KeyboardResponse';
import { parseKeys } from './parseKeys';

/**
 * The point of this type is to distinguish the description of the key bindings.
 * TODO: It would probably be more precise to say 'mac' or 'other'. Refactor?
 */
export type KeyboardType = 'mac' | 'win';

/**
 * A two-layer cache from hashId to keyString to Command.
 * Adding a command causes its bindKey property to be parsed and the hash is computed.
 * Utilities exist in lib/events for binding to KeyboardEvent targets and computing a stream consisting
 * of hashId: number and keyCode: number events. Utilities also exist in lib/keys to compute the key string from
 * the keyCode, enabling the findKeyCommand on this class to be called.
 */
export class KeyboardHandler<TARGET> {

    /**
     * hashId => name => Command
     * 
     * The hashId is computed by KeyboardEvent bindings in lib/events.ts
     */
    public readonly commandKeyBinding: { [hashId: number]: { [name: string]: Command<TARGET> } };

    /**
     *
     */
    public readonly commands: { [name: string]: Command<TARGET> };

    /**
     * The type of keyboard being used.
     */
    public readonly platform: KeyboardType;

    /**
     *
     */
    constructor(commands?: Command<TARGET>[], platform?: KeyboardType) {

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
            this.buildKeyHash(command);
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
    bindKey(bindKey: string, action: Action<TARGET>/*, position*/): void {
        if (!bindKey) {
            throw new TypeError("key must be a string.");
        }
        this.addCommand({ exec: action, bindKey: bindKey, name: bindKey });
    }

    /**
     * keys is a '|' (vertical bar) delimited list of keys.
     * If there is no key specified, no binding takes place.
     */
    bindCommand(keys: string | null, command: Command<TARGET>/*, position*/): void {
        if (!keys) {
            return;
        }

        const ckb = this.commandKeyBinding;

        keys.split("|").forEach((keyPart) => {
            const binding: KeyHash = parseKeys(keyPart);
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
     * The keys appropriate to the current platform (keyboard type) are extracted
     * and used
     * If the bindKey property on the command is not defined, nothing happens.
     */
    private buildKeyHash(command: Command<TARGET>): void {
        const bindKey = command.bindKey;
        if (!bindKey) {
            return;
        }

        /**
         *  The '|' delimited keys in the appropriate keyboard format.
         */
        const keys = typeof bindKey === "string" ? bindKey : bindKey[this.platform];
        this.bindCommand(keys, command);
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
