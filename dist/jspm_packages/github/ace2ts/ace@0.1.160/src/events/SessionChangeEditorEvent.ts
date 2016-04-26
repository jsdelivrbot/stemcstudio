import Editor from '../Editor';

/**
 * 'changeEditor' event emitted by a Session.
 *
 * @class SessionChangeEditorEvent
 */
interface SessionChangeEditorEvent {

    /**
     * @property oldEditor
     * @type Editor;
     */
    oldEditor?: Editor;

    /**
     * @property editor
     * @type Editor
     */
    editor?: Editor;
}

export default SessionChangeEditorEvent;
