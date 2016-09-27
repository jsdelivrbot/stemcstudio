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

import {FUNCTION_KEYS, KEY_MODS} from "../lib/keys";
import keyCodes from "../lib/keys";
import {isMac} from "../lib/useragent";
import Editor from '../Editor';
import EditorAction from "./EditorAction";
import KeyHash from './KeyHash';
import Command from '../commands/Command';
import KeyboardResponse from './KeyboardResponse';

/**
 * @class KeyboardHandler
 */
export default class KeyboardHandler {

    /**
     * @property commandKeyBinding
     */
    public commandKeyBinding: { [hashId: number]: { [name: string]: Command } };

    /**
     * @property commands
     */
    public commands: { [name: string]: Command };

    /**
     * @property platform
     * @type {string}
     */
    public platform: string;

    /**
     * @class KeyboardHandler
     * @constructor
     * @params [commands] {Command[]}
     * @params [platform] {string}
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
     * @method addCommand
     * @param command {Command}
     * @return {void}
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
     * @method removeCommand
     * @param command {string | Command}
     * @return {void}
     */
    removeCommand(command: string | Command): void {
        var name = (typeof command === 'string' ? command : command.name);
        command = this.commands[name];
        delete this.commands[name];

        // exhaustive search is brute force but since removeCommand is
        // not a performance critical operation this should be OK
        var ckb = this.commandKeyBinding;
        for (var hashId in ckb) {
            if (ckb.hasOwnProperty(hashId)) {
                for (var key in ckb[hashId]) {
                    if (ckb[hashId][key] === command) {
                        delete ckb[hashId][key];
                    }
                }
            }
        }
    }

    /**
     * Binds key alternatives to an action.
     * This is a convenience function for adding a command.
     * The name of the command is derived from the key alternatives string.
     *
     * @method bindKey
     * @param key {string}
     * @param action {EditorAction}
     * @return {void}
     */
    bindKey(key: string, action: EditorAction): void {
        if (!key) {
            throw new TypeError("key must be a string.");
        }
        this.addCommand({ exec: action, bindKey: key, name: key });
    }

    /**
     * @method bindCommand
     * @param key {string}
     * @param command {Command}
     * @return {void}
     */
    bindCommand(key: string, command: Command): void {
        var self = this;

        if (!key) {
            return;
        }

        var ckb = this.commandKeyBinding;

        key.split("|").forEach(function(keyPart) {
            var binding: KeyHash = self.parseKeys(keyPart/*, command*/);
            var hashId = binding.hashId;
            (ckb[hashId] || (ckb[hashId] = {}))[binding.key] = command;
        }, self);
    }

    /**
     * @method addCommands
     * @param commands {Command[]}
     * @return {void}
     */
    addCommands(commands: Command[]): void {
        for (let i = 0, iLength = commands.length; i < iLength; i++) {
            this.addCommand(commands[i]);
        }
    }

    /*
    addBindings(commands: { [name: string]: EditorAction }): void {
  
      commands && Object.keys(commands).forEach((name) => {
  
        var binding: EditorAction = commands[name];
  
        var command: Command = { name: name, exec: binding }
  
        this.addCommand(command);
      });
    }
    */

    /**
     * @method removeCommands
     * @param commands
     * @return {void}
     */
    removeCommands(commands: { [name: string]: string | Command }): void {
        Object.keys(commands).forEach((name) => {
            this.removeCommand(commands[name]);
        });
    }

    /**
     * @method bindKeys
     * @param keyList
     * @return {void}
     */
    bindKeys(keyList: { [name: string]: EditorAction }): void {
        var self = this;
        Object.keys(keyList).forEach(function(key) {
            self.bindKey(key, keyList[key]);
        }, self);
    }

    /**
     * @method _buildKeyHash
     * @param command {Command}
     * @return {void}
     */
    public _buildKeyHash(command: Command): void {
        var binding = command.bindKey;
        if (!binding)
            return;

        var key = typeof binding === "string" ? binding : binding[this.platform];
        this.bindCommand(key, command);
    }

    /**
     * accepts keys in the form ctrl+Enter or ctrl-Enter
     * keys without modifiers or shift only.
     *
     * @method parseKeys
     * @param keys {string}
     * @return {KeyHash}
     */
    parseKeys(keys: string): KeyHash {
        // todo support keychains 
        if (keys.indexOf(" ") !== -1)
            keys = keys.split(/\s+/).pop();

        var parts = keys.toLowerCase().split(/[\-\+]([\-\+])?/).filter(function(x: any) { return x; });
        var key = parts.pop();

        var keyCode = keyCodes[key];
        if (FUNCTION_KEYS[keyCode])
            key = FUNCTION_KEYS[keyCode].toLowerCase();
        else if (!parts.length)
            return { key: key, hashId: -1 };
        else if (parts.length === 1 && parts[0] === "shift")
            return { key: key.toUpperCase(), hashId: -1 };

        var hashId = 0;
        for (var i = parts.length; i--;) {
            var modifier = KEY_MODS[parts[i]];
            if (modifier === null) {
                throw new Error("invalid modifier " + parts[i] + " in " + keys);
            }
            hashId |= modifier;
        }
        return { key: key, hashId: hashId };
    }

    /**
     * @method findKeyCommand
     * @param hashId {number}
     * @param keyString {string}
     * @return {Command}
     */
    findKeyCommand(hashId: number, keyString: string): Command {
        var ckbr = this.commandKeyBinding;
        return ckbr[hashId] && ckbr[hashId][keyString];
    }

    /**
     * @method handleKeyboard
     * @param data {any}
     * @param hashId {number}
     * @param keyString {string}
     * @param [keyCode] {number}
     * @param [e] {KeyboardEvent}
     * @return {KeyboardResponse}
     */
    handleKeyboard(data: any, hashId: number, keyString: string, keyCode?: number, e?: KeyboardEvent): KeyboardResponse {
        var response = {
            command: this.findKeyCommand(hashId, keyString)
        };
        return response;
    }

    /**
     * @method attach
     * @param editor {Editor}
     * @return {void}
     */
    public attach(editor: Editor): void {
        // This implementation does nothing.
    }

    /**
     * @method detach
     * @param editor {Editor}
     * @return {void}
     */
    public detach(editor: Editor): void {
        // This implementation does nothing.
    }
}
