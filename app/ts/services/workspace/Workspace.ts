import * as ng from 'angular';
import Editor from '../../widgets/editor/Editor';

/**
 * TODO: The concept of workspace needs to be separated from editors
 * sufficiently to allow inclusion of closed files (not loaded in editor)
 * and to permit errors to be displayed outside or inside the gutter.
 */
interface Workspace {
    trace: boolean;
    initialize(callback: (err: any) => any): void;
    terminate(): void;
    synchronize(): ng.IPromise<any>;
    setDefaultLibrary(url: string): void;
    setModuleKind(moduleKind: string): void;
    setScriptTarget(scriptTarget: string): void;
    setTrace(trace: boolean): void;

    attachEditor(fileName: string, editor: Editor): void;
    detachEditor(fileName: string, editor: Editor): void;

    ensureScript(fileName: string, content: string): void;
    removeScript(fileName: string): void;

    /**
     * Enumerate the names of the files that have editors in the workspace.
     */
    getEditorFileNames(): string[];

    /**
     * @returns A reference to the editor associated with the specified file name.
     */
    getEditor(fileName: string): Editor;

    /**
     * Perform semantic analysis and update the appropriate editors.
     */
    semanticDiagnostics(): void;
    outputFiles(): void;
}

export default Workspace;
