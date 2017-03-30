import Editor from '../../editor/Editor';
import FormatCodeSettings from '../../editor/workspace/FormatCodeSettings';
import TextChange from '../../editor/workspace/TextChange';

interface WorkspaceMixin {
    /**
     * Notifies the workspace of the existence of an Editor for the specified path.
     * We attach the Editor so that it can receive semantic annotations which are
     * rendered by calling updateMarkerModels.
     * 
     * There is no explicit detachEditor because we use the returned detaching
     * function instead for that purpose.
     * 
     * @returns A function that may be used to detach the Editor.
     */
    attachEditor(path: string, mode: string, editor: Editor): () => void;

    /**
     * TODO: Replace with Promise<TextChange[]>
     */
    getFormattingEditsForDocument(path: string, settings: FormatCodeSettings, callback: (err: any, textChanges: TextChange[]) => any): void;
}

export default WorkspaceMixin;
