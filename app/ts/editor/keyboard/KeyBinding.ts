import { keyCodeToString } from "../lib/keys";
import { stopEvent } from "../lib/event";
import { COMMAND_NAME_INSERT_STRING } from "../editor_protocol";
import { CommandExecutor } from '../commands/CommandExecutor';
import { KeyboardHandler } from "./KeyboardHandler";
import { KeyboardResponse } from "./KeyboardResponse";

export interface TargetWithCommands<TARGET> {
    commands: CommandExecutor<TARGET>;
}

/**
 *
 */
export class KeyBinding<TARGET extends TargetWithCommands<TARGET>> {
    /**
     *
     */
    private readonly target: TARGET;
    private readonly $data: { target: TARGET };
    /**
     * Used by getEditorKeyboardShortcuts
     */
    public readonly $handlers: KeyboardHandler<TARGET>[] = [];
    /**
     * 
     */
    private $defaultHandler: KeyboardHandler<TARGET>;

    /**
     *
     */
    constructor(target: TARGET, defaultHandler: KeyboardHandler<TARGET>) {
        this.target = target;
        this.$data = { target };
        this.setDefaultHandler(defaultHandler);
    }

    /**
     * @param kb
     */
    setDefaultHandler(kb: KeyboardHandler<TARGET>): void {
        this.removeKeyboardHandler(this.$defaultHandler);
        this.$defaultHandler = kb;
        this.addKeyboardHandler(kb, 0);
    }

    /**
     * @param kb
     */
    setKeyboardHandler(kb: KeyboardHandler<TARGET> | null): void {
        const h = this.$handlers;
        if (h[h.length - 1] === kb)
            return;

        while (h[h.length - 1] && h[h.length - 1] !== this.$defaultHandler) {
            this.removeKeyboardHandler(h[h.length - 1]);
        }

        if (kb) {
            this.addKeyboardHandler(kb, 1);
        }
    }

    /**
     * @param kb
     * @param pos
     */
    addKeyboardHandler(kb: KeyboardHandler<TARGET>, pos?: number): void {
        if (!kb) {
            return;
        }
        /*
        if (typeof kb === "function" && !kb.handleKeyboard) {
            kb.handleKeyboard = kb;
        }
        */
        const i = this.$handlers.indexOf(kb);
        if (i !== -1) {
            this.$handlers.splice(i, 1);
        }

        if (pos === void 0) {
            this.$handlers.push(kb);
        }
        else {
            this.$handlers.splice(pos, 0, kb);
        }

        if (i === -1 && kb.attach) {
            kb.attach(this.target);
        }
    }

    /**
     * @param kb
     */
    removeKeyboardHandler(kb: KeyboardHandler<TARGET>): boolean {
        const i = this.$handlers.indexOf(kb);
        if (i === -1) {
            return false;
        }
        this.$handlers.splice(i, 1);
        if (kb.detach) {
            kb.detach(this.target);
        }
        return true;
    }

    /**
     *
     */
    getKeyboardHandler(): KeyboardHandler<TARGET> {
        return this.$handlers[this.$handlers.length - 1];
    }

    /**
     * @param hashId
     * @param keyString
     * @param keyCode
     * @param e
     */
    private $callKeyboardHandlers(hashId: number, keyString: string, keyCode?: number, e?: KeyboardEvent): boolean {

        let toExecute: KeyboardResponse<TARGET> | undefined;
        let success = false;
        const commands = this.target.commands;

        for (let i = this.$handlers.length; i--;) {
            toExecute = this.$handlers[i].handleKeyboard(this.$data, hashId, keyString, keyCode, e);
            if (!toExecute || !toExecute.command)
                continue;

            // allow keyboardHandler to consume keys
            if (toExecute.command === null) {
                success = true;
            }
            else {
                success = commands.exec(toExecute.command, this.target, toExecute.args);
            }
            // do not stop input events to not break repeating
            if (success && e && hashId !== -1 && toExecute.passEvent !== true && toExecute.command.passEvent !== true) {
                stopEvent(e);
            }
            if (success)
                break;
        }
        return success;
    }

    /**
     * @param e
     * @param hashId
     * @param keyCode
     */
    onCommandKey(e: KeyboardEvent, hashId: number, keyCode: number): void {
        const keyString = keyCodeToString(keyCode);
        this.$callKeyboardHandlers(hashId, keyString, keyCode, e);
    }

    /**
     * @param text
     */
    onTextInput(text: string): void {
        const success = this.$callKeyboardHandlers(-1, text);
        if (!success) {
            let command = this.target.commands.getCommandByName(COMMAND_NAME_INSERT_STRING);
            this.target.commands.exec(command, this.target, text);
        }
    }
}
