import Completion from '../Completion';
import Editor from '../Editor';
import EditSession from '../EditSession';
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
     * @param editor
     * @param position
     * @param prefix
     */
    getCompletionsAtPosition(editor: Editor, position: Position, prefix: string): Promise<Completion[]>;

    /**
     *
     */
    getCompletions(editor: Editor, session: EditSession, pos: Position, prefix: string, callback: (err: any, results: Completion[]) => any): void;

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
