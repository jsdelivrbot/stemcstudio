import Editor from '../Editor';

/**
 * 'changeEditor' event emitted by a Session.
 */
interface SessionChangeEditorEvent {

    /**
     *
     */
    oldEditor?: Editor;

    /**
     *
     */
    editor?: Editor;
}

export default SessionChangeEditorEvent;
