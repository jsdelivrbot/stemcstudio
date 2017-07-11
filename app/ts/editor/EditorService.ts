import { EditSession } from './EditSession';
import { Editor } from './Editor';
/**
 * The editor service is a factory for creating editors and sessions.
 */
export interface EditorService {
    createSession(text: string): EditSession;
    createEditor(container: HTMLElement): Editor;
}
