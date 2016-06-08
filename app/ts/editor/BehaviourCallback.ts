import Editor from  "./Editor";
import EditSession from "./EditSession";

/**
 * @class BehaviourCallback
 */
interface BehaviourCallback {
    /**
     * Executing the callback function returns a polymorphic value.
     *
     * @method
     * @param state {string}
     * @param action {string}
     * @param editor {Editor}
     * @param editSession {EditSession}
     * @param data {string | Range}
     * @return {void}
     */
    (state: string, action: string, editor: Editor, session: EditSession, data: any): any;
}

export default BehaviourCallback;
