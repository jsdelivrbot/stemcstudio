import { applyMixins } from "../lib/mix";
import { KeyboardHandler, KeyboardType } from "../keyboard/KeyboardHandler";
import { Action } from '../keyboard/Action';
import { EventEmitterClass } from "../lib/EventEmitterClass";
import { Command } from './Command';
import { CommandExecutor } from './CommandExecutor';
import { EventBus } from '../EventBus';
import { KeyboardResponse } from '../keyboard/KeyboardResponse';

interface CommandAndArgs<TARGET> {
    command: Command<TARGET>;
    args: any;
}

export type CommandManagerEventName = 'afterExec' | 'exec';

/**
 *
 */
export class CommandManager<TARGET> implements CommandExecutor<TARGET>, EventBus<CommandManagerEventName, any, CommandManager<TARGET>> {
    /**
     *
     */
    public readonly hashHandler: KeyboardHandler<TARGET>;
    /**
     *
     */
    private $inReplay: boolean;
    /**
     * Used by StatusBar
     */
    public recording: boolean;
    /**
     * A macro is a sequence of commands.
     */
    private macros: CommandAndArgs<TARGET>[][];
    private oldMacros: CommandAndArgs<TARGET>[][];
    private $addCommandToMacro: (event: any, cm: CommandManager<TARGET>) => any;
    private readonly eventBus: EventEmitterClass<CommandManagerEventName, any, CommandManager<TARGET>>;

    _buildKeyHash: any;

    /**
     * @param platform Identifier for the keyboard type; must be either `'mac'` or `'win'`
     * @param commands A list of commands
     */
    constructor(platform: KeyboardType, commands: Command<TARGET>[]) {
        this.eventBus = new EventEmitterClass<CommandManagerEventName, any, CommandManager<TARGET>>(this);
        this.hashHandler = new KeyboardHandler(commands, platform);
        this.eventBus.setDefaultHandler("exec", function (e) {
            if (e.command.exec) {
                return e.command.exec(e.target, e.args || {});
            }
        });
    }

    // FIXME: having to implement this is a bit wierd.
    changeStatus(): void {
        // Do nothing
    }

    setDefaultHandler(eventName: CommandManagerEventName, callback: (event: any, source: CommandManager<TARGET>) => any): void {
        this.eventBus.setDefaultHandler(eventName, callback);
    }

    removeDefaultHandler(eventName: CommandManagerEventName, callback: (event: any, source: CommandManager<TARGET>) => any): void {
        this.eventBus.removeDefaultHandler(eventName, callback);
    }

    get platform(): KeyboardType {
        return this.hashHandler.platform;
    }

    get commands() {
        return this.hashHandler.commands;
    }

    get commandKeyBinding() {
        return this.hashHandler.commandKeyBinding;
    }

    bindKey(key: string, command: Action<TARGET>): void {
        return this.hashHandler.bindKey(key, command);
    }

    bindKeys(keyList: { [name: string]: Action<TARGET> }): void {
        return this.hashHandler.bindKeys(keyList);
    }

    /**
     * @param command
     */
    addCommand(command: Command<TARGET>): void {
        this.hashHandler.addCommand(command);
    }

    removeCommand(commandName: string): void {
        this.hashHandler.removeCommand(commandName);
    }

    findKeyCommand(hashId: number, keyString: string): Command<TARGET> {
        return this.hashHandler.findKeyCommand(hashId, keyString);
    }

    addCommands(commands: Command<TARGET>[]): void {
        this.hashHandler.addCommands(commands);
    }

    removeCommands(commands: { [name: string]: (string | Command<TARGET>) }): void {
        this.hashHandler.removeCommands(commands);
    }

    handleKeyboard(data: any, hashId: number, keyString: string, keyCode: number): KeyboardResponse<TARGET> {
        return this.hashHandler.handleKeyboard(data, hashId, keyString, keyCode);
    }

    /**
     * @param name
     */
    getCommandByName(name: string): Command<TARGET> {
        return this.hashHandler.commands[name];
    }

    /**
     * Executes a <code>Command</code> in the context of an <code>Editor</code> using the specified arguments.
     */
    exec(command: Command<TARGET>, target?: TARGET, args?: any): boolean {
        if (typeof command === 'string') {
            throw new TypeError("command must not be a string.");
            // command = this.hashHandler.commands[command];
        }

        if (!command) {
            return false;
        }

        if (target && command.isAvailable && !command.isAvailable(target)) {
            return false;
        }

        const e = { target, command, args };
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

    toggleRecording(target: TARGET): boolean | undefined {
        if (this.$inReplay) {
            return void 0;
        }

        if (this.recording) {
            this.macros.pop();
            this.eventBus.off("exec", this.$addCommandToMacro);

            if (!this.macros.length) {
                this.macros = this.oldMacros;
            }

            return this.recording = false;
        }
        if (!this.$addCommandToMacro) {
            this.$addCommandToMacro = (step: CommandAndArgs<TARGET>) => {
                // FIXME: This does not look right
                const macro: CommandAndArgs<TARGET>[] = [step.command, step.args];
                this.macros.push(macro);
            };
        }

        this.oldMacros = this.macros;
        this.macros = [];
        this.eventBus.on("exec", this.$addCommandToMacro);
        return this.recording = true;
    }

    replay(target: TARGET): boolean | undefined {
        if (this.$inReplay || !this.macros)
            return void 0;

        if (this.recording)
            return this.toggleRecording(target);

        try {
            this.$inReplay = true;
            this.macros.forEach((macro) => {
                for (let i = 0; i < macro.length; i++) {
                    const step = macro[i];
                    this.exec(step.command, target, step.args);
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
    on(eventName: CommandManagerEventName, callback: (event: any, source: CommandManager<TARGET>) => any, capturing?: boolean): void {
        this.eventBus.on(eventName, callback, capturing);
    }

    /**
     * @param eventName
     * @param callback
     */
    off(eventName: CommandManagerEventName, callback: (event: any, source: CommandManager<TARGET>) => any): void {
        this.eventBus.off(eventName, callback);
    }
}

// TODO: This is a bit strange. If it is used, CommandManager should implement KeyboardHandler.
applyMixins(CommandManager, [KeyboardHandler]);
