import Completion from '../Completion';
import Editor from '../Editor';
import Position from '../Position';

/**
 *
 */
interface Completer {

    /**
     *
     */
    identifierRegexps?: RegExp[];

    /**
     *
     */
    getCompletionsAtPosition(editor: Editor, position: Position, prefix: string): Promise<Completion[]>;

    /**
     *
     */
    getCompletions(editor: Editor, position: Position, prefix: string, callback: (err: any, results: Completion[]) => any): void;

    /**
     * The completer may, optionally, define how it wants insertions to be performed.
     * TODO: But how does it know what the insertion is?
     */
    insertMatch?(editor: Editor): void;

    /**
     *
     */
    getDocTooltip?(completion: Completion): any;
}

export default Completer;
