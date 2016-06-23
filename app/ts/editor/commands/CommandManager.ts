import {applyMixins} from "../lib/mix";
import KeyboardHandler from "../keyboard/KeyboardHandler";
import KeyHash from "../keyboard/KeyHash";
import EventEmitterClass from "../lib/EventEmitterClass";
import Command from './Command';
import Editor from '../Editor';
import EventBus from '../EventBus';
import KeyboardResponse from '../keyboard/KeyboardResponse';

/**
 * @class CommandManager
 */
export default class CommandManager implements EventBus<any, CommandManager> {
    /**
     * @property hashHandler
     * @type KeyboardHandler
     */
    public hashHandler: KeyboardHandler;

    /**
     * @property $inReplay
     * @type boolean
     * @private
     */
    private $inReplay: boolean;

    /**
     * @property recording
     * @type boolean
     * @private
     */
    private recording: boolean;
    private macro: any[][];
    private oldMacro;
    private $addCommandToMacro: (event, cm: CommandManager) => any;
    private eventBus: EventEmitterClass<any, CommandManager>;

    _buildKeyHash;

    /**
     * @class CommandManager
     * @constructor
     * @param platform {string} Identifier for the platform; must be either `'mac'` or `'win'`
     * @param commands {Command[]} A list of commands
     */
    constructor(platform: string, commands: Command[]) {
        this.eventBus = new EventEmitterClass<any, CommandManager>(this);
        this.hashHandler = new KeyboardHandler(commands, platform);
        this.eventBus.setDefaultHandler("exec", function(e: { command: Command; editor: Editor; args }) {
            return e.command.exec(e.editor, e.args || {});
        });
    }

    setDefaultHandler(eventName: string, callback: (event: any, source: CommandManager) => any): void {
        this.eventBus.setDefaultHandler(eventName, callback);
    }

    removeDefaultHandler(eventName: string, callback: (event: any, source: CommandManager) => any): void {
        this.eventBus.removeDefaultHandler(eventName, callback);
    }

    get platform(): string {
        return this.hashHandler.platform;
    }

    get commands() {
        return this.hashHandler.commands;
    }

    get commandKeyBinding() {
        return this.hashHandler.commandKeyBinding;
    }

    bindKey(key: string, command: any) {
        return this.hashHandler.bindKey(key, command);
    }

    bindKeys(keyList) {
        return this.hashHandler.bindKeys(keyList);
    }

    /**
     * @method addCommand
     * @param command {Command}
     * @return {void}
     */
    addCommand(command: Command): void {
        this.hashHandler.addCommand(command);
    }

    removeCommand(commandName: string): void {
        this.hashHandler.removeCommand(commandName);
    }

    findKeyCommand(hashId: number, keyString: string): Command {
        return this.hashHandler.findKeyCommand(hashId, keyString);
    }

    parseKeys(keys: string): KeyHash {
        return this.hashHandler.parseKeys(keys);
    }

    addCommands(commands: Command[]): void {
        this.hashHandler.addCommands(commands);
    }

    removeCommands(commands): void {
        this.hashHandler.removeCommands(commands);
    }

    handleKeyboard(data: any, hashId: number, keyString: string, keyCode: number): KeyboardResponse {
        return this.hashHandler.handleKeyboard(data, hashId, keyString, keyCode);
    }

    /**
     * @method getCommandByName
     * @param name {string}
     * @return {Command}
     */
    getCommandByName(name: string): Command {
        return this.hashHandler.commands[name];
    }

    /**
     * Executes a <code>Command</code> in the context of an <code>Editor</code> using the specified arguments.
     */
    exec(command: Command, editor?: Editor, args?: any): boolean {
        if (typeof command === 'string') {
            throw new TypeError("command must not be a string.");
            // command = this.hashHandler.commands[command];
        }

        if (!command) {
            return false;
        }

        if (editor && editor.$readOnly && !command.readOnly) {
            return false;
        }

        var e = { editor: editor, command: command, args: args };
        /**
         * @event exec
         */
        var retvalue = this.eventBus._emit("exec", e);
        /**
         * @event afterExec
         */
        this.eventBus._signal("afterExec", e);

        return retvalue === false ? false : true;
    }

    toggleRecording(editor: Editor): boolean {
        if (this.$inReplay)
            return;

        if (editor) {
            editor._emit("changeStatus");
        }
        if (this.recording) {
            this.macro.pop();
            this.eventBus.off("exec", this.$addCommandToMacro);

            if (!this.macro.length)
                this.macro = this.oldMacro;

            return this.recording = false;
        }
        if (!this.$addCommandToMacro) {
            this.$addCommandToMacro = function(e) {
                this.macro.push([e.command, e.args]);
            }.bind(this);
        }

        this.oldMacro = this.macro;
        this.macro = [];
        this.eventBus.on("exec", this.$addCommandToMacro);
        return this.recording = true;
    }

    replay(editor: Editor) {
        if (this.$inReplay || !this.macro)
            return;

        if (this.recording)
            return this.toggleRecording(editor);

        try {
            this.$inReplay = true;
            this.macro.forEach(function(x) {
                if (typeof x === "string")
                    this.exec(x, editor);
                else
                    this.exec(x[0], editor, x[1]);
            }, this);
        } finally {
            this.$inReplay = false;
        }
    }

    trimMacro(m) {
        return m.map(function(x) {
            if (typeof x[0] !== "string")
                x[0] = x[0].name;
            if (!x[1])
                x = x[0];
            return x;
        });
    }

    /**
     * @method on
     * @param eventName {string}
     * @param callback {(event: any, source: CommandManager) => any}
     * @return {void}
     */
    on(eventName: string, callback: (event: any, source: CommandManager) => any, capturing?: boolean): void {
        this.eventBus.on(eventName, callback, capturing);
    }

    /**
     * @method off
     * @param eventName {string}
     * @param callback {(event, source: CommandManager) => any}
     * @return {void}
     */
    off(eventName: string, callback: (event: any, source: CommandManager) => any): void {
        this.eventBus.off(eventName, callback);
    }
}

applyMixins(CommandManager, [KeyboardHandler]);
