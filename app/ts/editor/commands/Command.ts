import { Action } from '../../editor/keyboard/Action';

/**
 * Associates an action function (the `exec` property) with a specification of key bindings.
 * Also allows the specification of other behaviors that determine whether the command is available
 * and what happens next in the editor. 
 */
export interface Command<TARGET> {

    /**
     *
     */
    name?: string;

    /**
     *
     */
    exec?: Action<TARGET>;

    /**
     *
     */
    bindKey?: string | { win: string | null; mac: string | null };

    /**
     * "fileJump", what else?
     */
    group?: 'fileJump';

    /**
     * 'single' is an instruction to exit the multi selection mode.
     */
    multiSelectAction?: 'forEach' | 'forEachLine' | 'single' | Action<TARGET>;

    /**
     *
     */
    passEvent?: boolean;

    /**
     * Means that this command can be performed when the editor is read-only.
     * Most commands leave this undefined, meaning that the editor must be writeable.
     * true if this command should apply in readOnly mode?
     * false if this command should not apply in readOnly mode
     */
    readOnly?: boolean;

    /**
     *
     */
    scrollIntoView?: 'animate' | 'center' | 'cursor' | 'none' | 'selection' | 'selectionPart';

    /**
     * Determines the context for the command.
     */
    isAvailable?: (target: TARGET) => boolean;
}
