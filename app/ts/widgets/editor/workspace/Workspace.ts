import Annotation from '../Annotation';
import AutoCompleteCommand from '../autocomplete/AutoCompleteCommand';
import CompletionEntry from './CompletionEntry';
import Delta from '../Delta';
import Diagnostic from './Diagnostic';
import Document from '../Document';
import getPosition from './getPosition';
import Marker from '../Marker';
import Editor from '../Editor';
import LanguageServiceProxy from './LanguageServiceProxy';
import Position from '../Position';
import OutputFile from './OutputFile';
import QuickInfo from './QuickInfo';
import QuickInfoTooltip from './QuickInfoTooltip';
import Range from '../Range';
import WorkspaceCompleter from './WorkspaceCompleter';
import {get} from '../lib/net';
import setModuleKindCallback from './SetModuleKindCallback';
import setScriptTargetCallback from './SetScriptTargetCallback';

function diagnosticToAnnotation(doc: Document, diagnostic: Diagnostic): Annotation {
    const minChar = diagnostic.start;
    const pos: Position = getPosition(doc, minChar);
    return { row: pos.row, column: pos.column, text: diagnostic.message, type: 'error' };
}

function checkFileName(fileName: string): void {
    if (typeof fileName !== 'string') {
        throw new Error("fileName must be a string.");
    }
}

function checkEditor(editor: Editor): void {
    if (typeof editor !== 'object') {
        throw new Error("editor must be an object.");
    }
}

function checkCallback(callback: (err: any) => any): void {
    if (typeof callback !== 'function') {
        throw new Error("callback must be a function.");
    }
}

enum WorkspaceState {
    CONSTRUCTED,
    INIT_PENDING,
    INIT_FAILED,
    OPERATIONAL,
    TERM_PENDING,
    TERM_FAILED,
    TERMINATED
}

function decodeWorkspaceState(state: WorkspaceState): string {
    switch (state) {
        case WorkspaceState.CONSTRUCTED: return "CONSTRUCTED";
        case WorkspaceState.INIT_PENDING: return "INIT_PENDING";
        case WorkspaceState.INIT_FAILED: return "INIT_FAILED";
        case WorkspaceState.OPERATIONAL: return "OPERATIONAL";
        case WorkspaceState.TERM_PENDING: return "TERM_PENDING";
        case WorkspaceState.TERM_FAILED: return "TERM_FAILED";
        case WorkspaceState.TERMINATED: return "TERMINATED";
        default: return `Unknown state ${state}`;
    }
}

/**
 * @class Workspace
 */
export default class Workspace {

    /**
     *
     */
    public trace: boolean = false;

    /**
     * Keep track of in-flight requests so that we can prevent cascading requests in an indeterminate state.
     * Increment before an asynchronous call is made.
     * Decrement when the response is received.
     */
    private inFlight: number = 0;

    /**
     *
     */
    private state: WorkspaceState;

    private editors: { [fileName: string]: Editor } = {};
    private quickin: { [fileName: string]: QuickInfoTooltip } = {};
    private annotationHandlers: { [fileName: string]: (event: any) => any } = {};
    private changeHandlers: { [fileName: string]: (event: any, source: Editor) => any } = {};

    private refMarkers: number[] = [];

    /**
     * The diagnostics allow us to place markers in the marker layer.
     * This array keeps track of the marker identifiers so that we can
     * remove the existing ones when the time comes to replace them.
     *
     * @property errorMarkerIds
     * @type number[]
     */
    private errorMarkerIds: number[] = [];

    /**
     * @property languageServiceProxy
     * @type LanguageServiceProxy
     * @private
     */
    private languageServiceProxy: LanguageServiceProxy;

    /**
     * @class Workspace
     * @constructor
     * @param workerUrl {string}
     * @param scriptImports {string[]}
     */
    constructor(workerUrl: string, private scriptImports: string[]) {
        this.languageServiceProxy = new LanguageServiceProxy(workerUrl);
        this.state = WorkspaceState.CONSTRUCTED;
    }

    /**
     * Initializes the workspace.
     *
     * @method init
     * @param callback {(err: any) => any}
     * @return {void}
     */
    public init(callback: (err: any) => any): void {
        checkCallback(callback);
        this.state = WorkspaceState.INIT_PENDING;
        this.inFlight++;
        this.languageServiceProxy.init(this.scriptImports, (err: any) => {
            this.inFlight--;
            if (!err) {
                this.state = WorkspaceState.OPERATIONAL;
            }
            else {
                this.state = WorkspaceState.INIT_FAILED;
            }
            callback(err);
        });
    }

    /**
     * Detaches any attached editors and terminates the worker thread.
     *
     * @method terminate
     * @param callback {(err: any) => any}
     * @return {void}
     */
    public terminate(callback: (err: any) => any): void {
        checkCallback(callback);
        this.detachEditors(function(err: any) {
            callback(err);
        });
        // Does this mean that we need a callback for terminate?
        // FIXME: inFlight
        this.state = WorkspaceState.TERM_PENDING;
        this.languageServiceProxy.terminate();
        this.state = WorkspaceState.TERMINATED;
    }

    /**
     * @method setDefaultLibrary
     * @param url {string}
     * @param callback {(err: any) => any}
     * @return {void}
     */
    public setDefaultLibrary(url: string, callback: (err: any) => any): void {
        checkCallback(callback);
        this.inFlight++;
        get(url, (err: Error, sourceCode: string) => {
            this.inFlight--;
            if (err) {
                callback(err);
            }
            else {
                if (this.languageServiceProxy) {
                    this.inFlight++;
                    this.languageServiceProxy.setDefaultLibContent(sourceCode, (err: any) => {
                        this.inFlight--;
                        callback(err);
                    });
                }
                else {
                    callback(new Error("languageServiceProxy is not defined."));
                }
            }
        });
    }

    /**
     * @method setModuleKind
     * @param moduleKind {string}
     * @param callback {setModuleKindCallback}
     * @return {void}
     */
    public setModuleKind(moduleKind: string, callback: setModuleKindCallback): void {
        checkCallback(callback);
        if (this.languageServiceProxy) {
            this.inFlight++;
            this.languageServiceProxy.setModuleKind(moduleKind, (err: any) => {
                this.inFlight--;
                callback(err);
            });
        }
        else {
            callback(new Error("moduleKind is not available."));
        }
    }

    /**
     * @method setScriptTarget
     * @param scriptTarget {string}
     * @param callback {setScriptTarget}
     * @return {void}
     */
    public setScriptTarget(scriptTarget: string, callback: setScriptTargetCallback): void {
        checkCallback(callback);
        if (this.languageServiceProxy) {
            this.inFlight++;
            this.languageServiceProxy.setScriptTarget(scriptTarget, (err: any) => {
                this.inFlight--;
                callback(err);
            });
        }
        else {
            callback(new Error("scriptTarget is not available."));
        }
    }

    /**
     * @method setTrace
     * @param trace {boolean}
     * @param callback {(err: any) => any}
     * @return {void}
     */
    public setTrace(trace: boolean, callback: (err: any) => any): void {
        checkCallback(callback);
        // We won't bother tracking inFlight for tracing.
        if (this.languageServiceProxy) {
            this.languageServiceProxy.setTrace(trace, callback);
        }
        else {
            callback(new Error("trace is not available."));
        }
    }

    /**
     * @method attachEditor
     * @param fileName {string}
     * @param editor {Editor}
     * @param callback {(err: any) => any}
     * @return {void}
     */
    public attachEditor(fileName: string, editor: Editor, callback: (err: any) => any): void {

        // Check arguments.
        checkFileName(fileName);
        checkEditor(editor);
        checkCallback(callback);

        // Idempotency.
        if (this.editors[fileName]) {
            setTimeout(callback, 0);
            return;
        }
        else {
            this.editors[fileName] = editor;
        }

        const changeHandler = (delta: Delta, source: Editor) => {
            this.inFlight++;
            this.languageServiceProxy.applyDelta(fileName, delta, (err: any) => {
                this.inFlight--;
                if (!err) {
                    this.updateMarkerModels(fileName, delta);
                }
                else {
                    console.warn(`applyDelta ${delta} to '${fileName}' failed because ${err}. Marker models will not e updated.`);
                }
            });
        };
        editor.on('change', changeHandler);
        this.changeHandlers[fileName] = changeHandler;

        // When the LanguageMode has completed syntax analysis, it emits annotations.
        // This is our cue to begin semantic analysis and make use of transpiled files.
        const annotationsHandler = (event: { data: Annotation[]; type: string }) => {
            if (this.inFlight === 0) {
                this.semanticDiagnostics();
                this.outputFiles();
            }
            else {
                // console.warn(`Ignoring 'annotations' event because inFlight => ${this.inFlight}`);
            }
        };
        editor.session.on('annotations', annotationsHandler);
        this.annotationHandlers[fileName] = annotationsHandler;

        // Enable auto completion using the Workspace.
        // The command seems to be required on order to enable method completion.
        // However, it has the side-effect of enabling global completions (Ctrl-Space, etc).
        editor.commands.addCommand(new AutoCompleteCommand());
        editor.completers.push(new WorkspaceCompleter(fileName, this));

        // Finally, enable QuickInfo.
        const quickInfo = new QuickInfoTooltip(fileName, editor, this);
        quickInfo.init();
        this.quickin[fileName] = quickInfo;

        // Ensure the script in the language service.
        this.ensureScript(fileName, editor.getValue(), callback);
    }

    /**
     * @method detachEditor
     * @param fileName {string}
     * @param editor {Editor}
     * @param callback {(err: any) => any}
     * @return {void}
     */
    public detachEditor(fileName: string, editor: Editor, callback: (err: any) => any): void {

        // Check Arguments.
        checkFileName(fileName);
        checkEditor(editor);
        checkCallback(callback);

        // Idempotency.
        if (!this.editors[fileName]) {
            setTimeout(callback, 0);
            return;
        }
        else {
            delete this.editors[fileName];
        }

        // Remove QuickInfo
        const quickInfo = this.quickin[fileName];
        quickInfo.terminate();
        delete this.quickin[fileName];

        // Remove Annotation Handlers.
        const annotationHandler = this.annotationHandlers[fileName];
        editor.session.off('annotations', annotationHandler);
        delete this.annotationHandlers[fileName];

        // Remove Change Handlers.
        const changeHandler = this.changeHandlers[fileName];
        editor.off('change', changeHandler);
        delete this.changeHandlers[fileName];

        // Remove the script from the language service.
        this.removeScript(fileName, callback);
    }

    /**
     * @method detachEditors
     * @param callback {(err: any) => any}
     * @return {void}
     */
    public detachEditors(callback: (err: any) => any): void {
        checkCallback(callback);

        const fileNames = Object.keys(this.editors);
        const iLength = fileNames.length;
        let iCount = 0;
        for (let i = 0; i < iLength; i++) {
            const fileName = fileNames[i];
            const editor = this.editors[fileName];
            this.detachEditor(fileName, editor, function(err: any) {
                iCount++;
                if (iCount === iLength) {
                    callback(void 0);
                }
            });
        }
    }

    /**
     * @method ensureScript
     * @param fileName {string}
     * @param content {string}
     * @param callback {(err: any) => any}
     * @return {void}
     */
    public ensureScript(fileName: string, content: string, callback: (err: any) => any): void {
        checkFileName(fileName);
        checkCallback(callback);

        this.inFlight++;
        this.languageServiceProxy.ensureScript(fileName, content, (err: any) => {
            this.inFlight--;
            if (!err) {
                callback(void 0);
            }
            else {
                callback(err);
            }
        });
    }

    /**
     * @returns The names of files that have an associated editor.
     */
    public getEditorFileNames(): string[] {
        return Object.keys(this.editors);
    }

    /**
     * @param fileName
     * @returns The editor for the specified file name.
     */
    public getEditor(fileName: string): Editor {
        return this.editors[fileName];
    }

    /**
     * TODO: This is exactly the function we would like to call to refresh the editor semantic annotations.
     */
    public semanticDiagnostics() {
        const fileNames = Object.keys(this.editors);
        for (let i = 0; i < fileNames.length; i++) {
            const fileName = fileNames[i];
            const editor = this.editors[fileName];
            this.semanticDiagnosticsForEditor(fileName, editor);
        }
    }

    private updateEditor(fileName: string, errors: Diagnostic[], editor: Editor): void {
        checkEditor(editor);

        const session = editor.getSession();
        const doc = session.getDocument();

        const annotations = errors.map(function(error) {
            return diagnosticToAnnotation(editor.getSession().getDocument(), error);
        });
        session.setAnnotations(annotations);

        this.errorMarkerIds.forEach(function(markerId) { session.removeMarker(markerId); });

        errors.forEach((error: { message: string; start: number; length: number }) => {
            const minChar = error.start;
            const limChar = minChar + error.length;
            const start = getPosition(doc, minChar);
            const end = getPosition(doc, limChar);
            const range = new Range(start.row, start.column, end.row, end.column);
            // Add a new marker to the given Range. The last argument (inFront) causes a
            // front marker to be defined and the 'changeFrontMarker' event fires.
            // The class parameter is a css stylesheet class so you must have it in your CSS.
            this.errorMarkerIds.push(session.addMarker(range, "typescript-error", "text", null, true));
        });
    }

    private semanticDiagnosticsForEditor(fileName: string, editor: Editor): void {
        checkFileName(fileName);

        this.inFlight++;
        this.languageServiceProxy.getSyntaxErrors(fileName, (err: any, syntaxErrors: Diagnostic[]) => {
            this.inFlight--;
            if (err) {
                console.warn(`getSyntaxErrors(${fileName}) => ${err}`);
            }
            else {
                this.updateEditor(fileName, syntaxErrors, editor);
                if (syntaxErrors.length === 0) {
                    this.inFlight++;
                    this.languageServiceProxy.getSemanticErrors(fileName, (err: any, semanticErrors: Diagnostic[]) => {
                        this.inFlight--;
                        if (err) {
                            console.warn(`getSemanticErrors(${fileName}) => ${err}`);
                        }
                        else {
                            this.updateEditor(fileName, semanticErrors, editor);
                        }
                    });
                }
            }
        });
    }

    /**
     * @method outputFiles
     * @return {void}
     */
    public outputFiles(): void {
        const fileNames = Object.keys(this.editors);
        for (let i = 0; i < fileNames.length; i++) {
            const fileName = fileNames[i];
            const editor = this.editors[fileName];
            this.outputFilesForEditor(fileName, editor);
        }
    }

    private outputFilesForEditor(fileName: string, editor: Editor): void {
        checkFileName(fileName);
        checkEditor(editor);

        const session = editor.getSession();

        this.inFlight++;
        this.languageServiceProxy.getOutputFiles(fileName, (err: any, outputFiles: OutputFile[]) => {
            this.inFlight--;
            if (!err) {
                session._emit("outputFiles", { data: outputFiles });
            }
            else {
                console.warn(`getOutputFiles(${fileName}) => ${err}`);
            }
        });
    }

    /**
     * @method getCompletionsAtPosition
     * @param fileName {string}
     * @param position {number}
     * @param prefix {string}
     * @return {Promise} CompletionEntry[]
     */
    getCompletionsAtPosition(fileName: string, position: number, prefix: string): Promise<CompletionEntry[]> {
        checkFileName(fileName);
        // FIXME: Promises make it messy to hook for inFlight.
        return this.languageServiceProxy.getCompletionsAtPosition(fileName, position, prefix);
    }

    /**
     * @method getQuickInfoAtPosition
     * @param fileName {string}
     * @param position {number}
     * @return {void}
     */
    getQuickInfoAtPosition(fileName: string, position: number, callback: (err: any, quickInfo: QuickInfo) => any): void {
        checkFileName(fileName);
        this.inFlight++;
        return this.languageServiceProxy.getQuickInfoAtPosition(fileName, position, (err: any, quickInfo: QuickInfo) => {
            this.inFlight--;
            callback(err, quickInfo);
        });
    }

    /**
     * @method removeScript
     * @param fileName {string}
     * @param callback {(err: any) => any}
     * @return {void}
     */
    public removeScript(fileName: string, callback: (err: any) => any): void {
        checkFileName(fileName);
        checkCallback(callback);
        this.inFlight++;
        this.languageServiceProxy.removeScript(fileName, (err: any) => {
            this.inFlight--;
            if (!err) {
                callback(void 0);
            }
            else {
                callback(err);
            }
        });
    }

    private updateMarkerModels(fileName: string, delta: Delta): void {
        checkFileName(fileName);
        const editor = this.editors[fileName];
        if (editor) {
            const action = delta.action;
            const markers: { [id: number]: Marker } = editor.getSession().getMarkers(true);
            let lineCount = 0;
            if (action === "insert") {
                lineCount = delta.lines.length;
            }
            else if (action === "remove") {
                lineCount = -delta.lines.length;
            }
            else {
                console.warn(`updateMarkerModels(${fileName}, ${JSON.stringify(delta)})`);
            }
            if (lineCount !== 0) {
                const markerUpdate = function(markerId: number) {
                    const marker: Marker = markers[markerId];
                    let row = delta.start.row;
                    if (lineCount > 0) {
                        row = +1;
                    }
                    if (marker && marker.range.start.row > row) {
                        marker.range.start.row += lineCount;
                        marker.range.end.row += lineCount;
                    }
                };
                this.errorMarkerIds.forEach(markerUpdate);
                this.refMarkers.forEach(markerUpdate);
                editor.updateFrontMarkers();
            }
        }
    }
}
