import Completion from '../Completion';
import Editor from '../Editor';
import EditSession from '../EditSession';
import Position from '../Position';

/**
 * @class Completer
 */
interface Completer {
    /**
     * @method getCompletionsAtPosition
     * @param editor {Editor}
     * @param position {Position}
     * @param prefix {string}
     * @return {Promise} Completion[]
     */
    getCompletionsAtPosition(editor: Editor, position: Position, prefix: string): Promise<Completion[]>;

    /**
     * Intentionally undocumented.
     * deprecated
     */
    getCompletions(editor: Editor, session: EditSession, pos: Position, prefix: string, callback: (err, results: Completion[]) => any);
}

export default Completer;
