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
     * @method getCompletionsAtPosition
     * @param editor {Editor}
     * @param position {Position}
     * @param prefix {string}
     * @return {Promise} Completion[]
     */
    getCompletionsAtPosition(editor: Editor, position: Position, prefix: string): Promise<Completion[]>;

    /**
     *
     */
    getCompletions(editor: Editor, session: EditSession, pos: Position, prefix: string, callback: (err, results: Completion[]) => any);

    /**
     * The completer may, optionally, define how it wants insertions to be performed.
     * TODO: But how does it know what the insertion is?u
     */
    insertMatch?(editor: Editor): void;

    /**
     *
     */
    getDocTooltip?(completion: Completion);
}

export default Completer;
