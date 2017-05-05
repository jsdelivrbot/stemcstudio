import { Editor } from '../Editor';
import EditorAction from '../keyboard/EditorAction';

/**
 *
 */
interface Command {

    /**
     *
     */
    name?: string;

    /**
     *
     */
    exec?: EditorAction;

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
    multiSelectAction?: 'forEach' | 'forEachLine' | 'single' | EditorAction;

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
    isAvailable?: (editor: Editor) => boolean;
}

export default Command;
