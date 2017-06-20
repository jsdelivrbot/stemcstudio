import { Editor } from '../Editor';

/**
 * 'changeEditor' event emitted by a Session.
 */
export interface SessionChangeEditorEvent {

    /**
     *
     */
    oldEditor?: Editor;

    /**
     *
     */
    editor?: Editor;
}
