import MwEditor from './MwEditor';

/**
 * The adapter on the user's workspace.
 */
interface MwWorkspace {
    /**
     *
     */
    createEditor(): MwEditor;

    /**
     * 
     */
    deleteEditor(editor: MwEditor): void;
}

export default MwWorkspace;
