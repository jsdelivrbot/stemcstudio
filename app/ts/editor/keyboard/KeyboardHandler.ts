/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */
"use strict";

import { FUNCTION_KEYS, KEY_MODS } from "../lib/keys";
import keyCodes from "../lib/keys";
import { isMac } from "../lib/useragent";
import Editor from '../Editor';
import EditorAction from "./EditorAction";
import KeyHash from './KeyHash';
import Command from '../commands/Command';
import KeyboardResponse from './KeyboardResponse';

/**
 *
 */
export default class KeyboardHandler {

    /**
     *
     */
    public commandKeyBinding: { [hashId: number]: { [name: string]: Command } };

    /**
     *
     */
    public commands: { [name: string]: Command };

    /**
     *
     */
    public platform: string;

    /**
     *
     */
    constructor(commands?: Command[], platform?: string) {

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
    addCommand(command: Command): void {
        if (this.commands[command.name]) {
            this.removeCommand(command);
        }

        this.commands[command.name] = command;

        if (command.bindKey) {
            this._buildKeyHash(command);
        }
    }

    /**
     *
     */
    removeCommand(command: string | Command /* | { [name: string]: Command }*/, keepCommand = false): void {
        const name = (typeof command === 'string' ? command : command.name);
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
     * This is a convenience function for adding a command.
     * The name of the command is derived from the key alternatives string.
     */
    bindKey(key: string, action: EditorAction/*, position*/): void {
        if (!key) {
            throw new TypeError("key must be a string.");
        }
        this.addCommand({ exec: action, bindKey: key, name: key });
    }

    /**
     *
     */
    bindCommand(key: string, command: Command/*, position*/): void {
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
    addCommands(commands: Command[]): void {
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
    removeCommands(commands: { [name: string]: string | Command }): void {
        Object.keys(commands).forEach((name) => {
            this.removeCommand(commands[name]);
        });
    }

    /**
     *
     */
    bindKeys(keyList: { [name: string]: EditorAction }): void {
        Object.keys(keyList).forEach((key) => {
            this.bindKey(key, keyList[key]);
        });
    }

    /**
     *
     */
    public _buildKeyHash(command: Command): void {
        const binding = command.bindKey;
        if (!binding)
            return;

        const key = typeof binding === "string" ? binding : binding[this.platform];
        this.bindCommand(key, command);
    }

    /**
     * accepts keys in the form ctrl+Enter or ctrl-Enter
     * keys without modifiers or shift only.
     */
    parseKeys(keys: string): KeyHash {
        // todo support keychains 
        if (keys.indexOf(" ") !== -1)
            keys = keys.split(/\s+/).pop();

        const parts = keys.toLowerCase().split(/[\-\+]([\-\+])?/).filter(function (x: any) { return x; });
        let key = parts.pop();

        const keyCode = keyCodes[key];
        if (FUNCTION_KEYS[keyCode])
            key = FUNCTION_KEYS[keyCode].toLowerCase();
        else if (!parts.length)
            return { key: key, hashId: -1 };
        else if (parts.length === 1 && parts[0] === "shift")
            return { key: key.toUpperCase(), hashId: -1 };

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
    findKeyCommand(hashId: number, keyString: string): Command {
        const ckbr = this.commandKeyBinding;
        return ckbr[hashId] && ckbr[hashId][keyString];
    }

    /**
     *
     */
    handleKeyboard(data: any, hashId: number, keyString: string, keyCode?: number, e?: KeyboardEvent): KeyboardResponse {
        const response = {
            command: this.findKeyCommand(hashId, keyString)
        };
        return response;
    }

    /**
     *
     */
    public attach(editor: Editor): void {
        // This implementation does nothing.
    }

    /**
     *
     */
    public detach(editor: Editor): void {
        // This implementation does nothing.
    }
}
