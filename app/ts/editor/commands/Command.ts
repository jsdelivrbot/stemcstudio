import { Action } from '../../virtual/editor';

/**
 *
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
