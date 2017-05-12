import { EditorMinimal } from '../../virtual/EditorMinimal';
import { LanguageModeId } from '../../virtual/editor';
import { FormatCodeSettings } from '../../editor/workspace/FormatCodeSettings';
import { TextChange } from '../../editor/workspace/TextChange';

/**
 * The means by which an `Editor` connects-to and interacts-with a workspace.
 * 
 * This interface is intended to be implemented by controllers.
 * This is expected because Editor is a "micro" controller.
 */
export interface WorkspaceEditorHost {
    /**
     * Notifies the workspace of the existence of an Editor for the specified path.
     * We attach the Editor so that it can receive semantic annotations which are
     * rendered by calling updateMarkerModels.
     * 
     * There is no explicit detachEditor because we use the returned detaching
     * function instead for that purpose.
     */
    attachEditor(path: string, mode: LanguageModeId, editor: EditorMinimal): () => void;

    /**
     * Used to obtain formatting edits for an editor.
     * The function is asynchronous because a Language Service will typically run
     * in a thread or be located on a remote network endpoint.
     */
    getFormattingEditsForDocument(path: string, settings: FormatCodeSettings): Promise<TextChange<number>[]>;
}
