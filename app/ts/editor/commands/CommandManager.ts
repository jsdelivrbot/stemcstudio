import { applyMixins } from "../lib/mix";
import KeyboardHandler from "../keyboard/KeyboardHandler";
import KeyHash from "../keyboard/KeyHash";
import EditorAction from '../keyboard/EditorAction';
import EventEmitterClass from "../lib/EventEmitterClass";
import Command from './Command';
import Editor from '../Editor';
import EventBus from '../EventBus';
import KeyboardResponse from '../keyboard/KeyboardResponse';

/**
 *
 */
export default class CommandManager implements EventBus<any, CommandManager> {
    /**
     *
     */
    public hashHandler: KeyboardHandler;
    /**
     *
     */
    private $inReplay: boolean;
    /**
     * Used by StatusBar
     */
    public recording: boolean;
    private macro: { command: Command; args: any }[][];
    private oldMacro: { command: Command; args: any }[][];
    private $addCommandToMacro: (event: any, cm: CommandManager) => any;
    private eventBus: EventEmitterClass<any, CommandManager>;

    _buildKeyHash: any;

    /**
     * @param platform Identifier for the platform; must be either `'mac'` or `'win'`
     * @param commands A list of commands
     */
    constructor(platform: string, commands: Command[]) {
        this.eventBus = new EventEmitterClass<any, CommandManager>(this);
        this.hashHandler = new KeyboardHandler(commands, platform);
        this.eventBus.setDefaultHandler("exec", function (e: { command: Command; editor: Editor; args: any }) {
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

    bindKey(key: string, command: EditorAction): void {
        return this.hashHandler.bindKey(key, command);
    }

    bindKeys(keyList: { [name: string]: EditorAction }): void {
        return this.hashHandler.bindKeys(keyList);
    }

    /**
     * @param command
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

    removeCommands(commands: { [name: string]: (string | Command) }): void {
        this.hashHandler.removeCommands(commands);
    }

    handleKeyboard(data: any, hashId: number, keyString: string, keyCode: number): KeyboardResponse {
        return this.hashHandler.handleKeyboard(data, hashId, keyString, keyCode);
    }

    /**
     * @param name
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

        if (command.isAvailable && !command.isAvailable(editor)) {
            return false;
        }

        const e = { editor: editor, command: command, args: args };
        /**
         * @event exec
         */
        const retvalue = this.eventBus._emit("exec", e);
        /**
         * @event afterExec
         */
        this.eventBus._signal("afterExec", e);

        return retvalue === false ? false : true;
    }

    toggleRecording(editor: Editor): boolean {
        if (this.$inReplay)
            return void 0;

        if (editor) {
            editor._emit("changeStatus");
        }
        if (this.recording) {
            this.macro.pop();
            this.eventBus.off("exec", this.$addCommandToMacro);

            if (!this.macro.length) {
                this.macro = this.oldMacro;
            }

            return this.recording = false;
        }
        if (!this.$addCommandToMacro) {
            this.$addCommandToMacro = (e: { command: Command; args: any }) => {
                this.macro.push([e.command, e.args]);
            };
        }

        this.oldMacro = this.macro;
        this.macro = [];
        this.eventBus.on("exec", this.$addCommandToMacro);
        return this.recording = true;
    }

    replay(editor: Editor): boolean {
        if (this.$inReplay || !this.macro)
            return void 0;

        if (this.recording)
            return this.toggleRecording(editor);

        try {
            this.$inReplay = true;
            this.macro.forEach((x) => {
                if (typeof x === "string")
                    // FIXME: This never happens?
                    this.exec(x, editor);
                else {
                    for (let i = 0; i < x.length; i++) {
                        const macro = x[i];
                        this.exec(macro.command, editor, macro.args);
                    }
                }
            });
        }
        finally {
            this.$inReplay = false;
        }
        return void 0;
    }

    trimMacro(m: any[]) {
        return m.map(function (x) {
            if (typeof x[0] !== "string")
                x[0] = x[0].name;
            if (!x[1])
                x = x[0];
            return x;
        });
    }

    /**
     * @param eventName
     * @param callback
     */
    on(eventName: string, callback: (event: any, source: CommandManager) => any, capturing?: boolean): void {
        this.eventBus.on(eventName, callback, capturing);
    }

    /**
     * @param eventName
     * @param callback
     */
    off(eventName: string, callback: (event: any, source: CommandManager) => any): void {
        this.eventBus.off(eventName, callback);
    }
}

applyMixins(CommandManager, [KeyboardHandler]);
