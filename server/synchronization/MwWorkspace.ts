import { MwEditor } from './MwEditor';

/**
 * The adapter on the user's workspace.
 */
export interface MwWorkspace {
    /**
     *
     */
    createEditor(): MwEditor;

    /**
     * 
     */
    deleteEditor(editor: MwEditor);
}
