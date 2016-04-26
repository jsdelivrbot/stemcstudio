import * as ng from 'angular';

interface Workspace {
    trace: boolean;
    initialize(): void;
    terminate(): void;
    synchronize(): ng.IPromise<any>;
    setDefaultLibrary(url: string): void;
    setModuleKind(moduleKind: string): void;
    setScriptTarget(scriptTarget: string): void;

    attachEditor(fileName: string, editor: ace.Editor): void;
    detachEditor(fileName: string, editor: ace.Editor): void;

    ensureScript(fileName: string, content: string): void;
    removeScript(fileName: string): void;
}

export default Workspace;
