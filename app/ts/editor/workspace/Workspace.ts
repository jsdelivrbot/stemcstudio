import Annotation from '../Annotation';
import AutoCompleteCommand from '../autocomplete/AutoCompleteCommand';
import CompletionEntry from './CompletionEntry';
import Delta from '../Delta';
import Diagnostic from './Diagnostic';
import Document from '../Document';
import getPosition from './getPosition';
import Marker from '../Marker';
import Editor from '../Editor';
import EditSession from '../EditSession';
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

function checkPath(path: string): void {
    if (typeof path !== 'string') {
        throw new Error("path must be a string.");
    }
}

function checkEditor(editor: Editor): void {
    if (!(editor instanceof Editor)) {
        throw new Error("editor must be an Editor.");
    }
}

function checkSession(session: EditSession): void {
    if (!(session instanceof EditSession)) {
        throw new Error("session must be an EditSession.");
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
 * Determines whether the file is appropriate for the language service.
 * All editors (files) are loaded in the workspace but only TypeScript
 * files are offered to the language service.
 */
function isTypeScript(path: string): boolean {
    const period = path.lastIndexOf('.');
    if (period >= 0) {
        const extension = path.substring(period + 1);
        switch (extension) {
            case 'ts': {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    console.warn(`isTypeScript('${path}') can't figure that one out.`);
    return false;
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

    /**
     *
     */
    private editors: { [path: string]: Editor } = {};
    private quickin: { [path: string]: QuickInfoTooltip } = {};
    private annotationHandlers: { [path: string]: (event: any) => any } = {};
    private changeHandlers: { [path: string]: (event: any, source: Editor) => any } = {};

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
     * @param path
     * @param editor
     * @param callback
     */
    public attachEditor(path: string, editor: Editor, callback: (err: any) => any): void {

        // Check arguments.
        checkPath(path);
        checkEditor(editor);
        checkCallback(callback);

        // Idempotency.
        if (this.editors[path]) {
            setTimeout(callback, 0);
            return;
        }
        else {
            this.editors[path] = editor;
        }

        if (isTypeScript(path)) {
            const changeHandler = (delta: Delta, source: Editor) => {
                this.inFlight++;
                this.languageServiceProxy.applyDelta(path, delta, (err: any) => {
                    this.inFlight--;
                    if (!err) {
                        this.updateMarkerModels(path, delta);
                    }
                    else {
                        console.warn(`applyDelta ${delta} to '${path}' failed because ${err}. Marker models will not be updated.`);
                    }
                });
            };
            editor.on('change', changeHandler);
            this.changeHandlers[path] = changeHandler;

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
            this.annotationHandlers[path] = annotationsHandler;

            // Enable auto completion using the Workspace.
            // The command seems to be required on order to enable method completion.
            // However, it has the side-effect of enabling global completions (Ctrl-Space, etc).
            editor.commands.addCommand(new AutoCompleteCommand());
            editor.completers.push(new WorkspaceCompleter(path, this));

            // Finally, enable QuickInfo.
            const quickInfo = new QuickInfoTooltip(path, editor, this);
            quickInfo.init();
            this.quickin[path] = quickInfo;

            // Ensure the script in the language service.
            this.ensureScript(path, editor.getValue(), callback);
        }
    }

    /**
     * @method detachEditor
     * @param path {string}
     * @param editor {Editor}
     * @param callback {(err: any) => any}
     * @return {void}
     */
    public detachEditor(path: string, editor: Editor, callback: (err: any) => any): void {

        // Check Arguments.
        checkPath(path);
        checkEditor(editor);
        checkCallback(callback);

        // Idempotency.
        if (!this.editors[path]) {
            setTimeout(callback, 0);
            return;
        }
        else {
            delete this.editors[path];
        }

        if (isTypeScript(path)) {
            // Remove QuickInfo
            const quickInfo = this.quickin[path];
            quickInfo.terminate();
            delete this.quickin[path];

            // Remove Annotation Handlers.
            const annotationHandler = this.annotationHandlers[path];
            editor.session.off('annotations', annotationHandler);
            delete this.annotationHandlers[path];

            // Remove Change Handlers.
            const changeHandler = this.changeHandlers[path];
            editor.off('change', changeHandler);
            delete this.changeHandlers[path];

            // Remove the script from the language service.
            this.removeScript(path, callback);
        }
    }

    /**
     * @method detachEditors
     * @param callback {(err: any) => any}
     * @return {void}
     */
    public detachEditors(callback: (err: any) => any): void {
        checkCallback(callback);

        const paths = Object.keys(this.editors);
        const iLength = paths.length;
        let iCount = 0;
        for (let i = 0; i < iLength; i++) {
            const path = paths[i];
            const editor = this.editors[path];
            this.detachEditor(path, editor, function(err: any) {
                iCount++;
                if (iCount === iLength) {
                    callback(void 0);
                }
            });
        }
    }

    /**
     * @method ensureScript
     * @param path {string}
     * @param content {string}
     * @param callback {(err: any) => any}
     * @return {void}
     */
    public ensureScript(path: string, content: string, callback: (err: any) => any): void {
        checkPath(path);
        checkCallback(callback);

        this.inFlight++;
        this.languageServiceProxy.ensureScript(path, content, (err: any) => {
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
    public getEditorPaths(): string[] {
        return Object.keys(this.editors);
    }

    /**
     * @param path
     * @returns The editor for the specified file name.
     */
    public getEditor(path: string): Editor {
        return this.editors[path];
    }

    public getEditSession(path: string): EditSession {
        return this.editors[path].getSession();
    }

    /**
     * TODO: This is exactly the function we would like to call to refresh the editor semantic annotations.
     */
    public semanticDiagnostics() {
        const paths = Object.keys(this.editors);
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            if (isTypeScript(path)) {
                const session = this.editors[path].getSession();
                this.semanticDiagnosticsForSession(path, session);
            }
        }
    }

    private updateSession(path: string, errors: Diagnostic[], session: EditSession): void {
        checkSession(session);

        const doc = session.getDocument();

        const annotations = errors.map(function(error) {
            return diagnosticToAnnotation(doc, error);
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

    private semanticDiagnosticsForSession(path: string, session: EditSession): void {
        checkPath(path);

        this.inFlight++;
        this.languageServiceProxy.getSyntaxErrors(path, (err: any, syntaxErrors: Diagnostic[]) => {
            this.inFlight--;
            if (err) {
                console.warn(`getSyntaxErrors(${path}) => ${err}`);
            }
            else {
                this.updateSession(path, syntaxErrors, session);
                if (syntaxErrors.length === 0) {
                    this.inFlight++;
                    this.languageServiceProxy.getSemanticErrors(path, (err: any, semanticErrors: Diagnostic[]) => {
                        this.inFlight--;
                        if (err) {
                            console.warn(`getSemanticErrors(${path}) => ${err}`);
                        }
                        else {
                            this.updateSession(path, semanticErrors, session);
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
        const paths = Object.keys(this.editors);
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            if (isTypeScript(path)) {
                const editor = this.editors[path];
                this.outputFilesForSession(path, editor.getSession());
            }
        }
    }

    private outputFilesForSession(path: string, session: EditSession): void {
        checkPath(path);
        checkSession(session);

        this.inFlight++;
        this.languageServiceProxy.getOutputFiles(path, (err: any, outputFiles: OutputFile[]) => {
            this.inFlight--;
            if (!err) {
                session._emit("outputFiles", { data: outputFiles });
            }
            else {
                console.warn(`getOutputFiles(${path}) => ${err}`);
            }
        });
    }

    /**
     * @method getCompletionsAtPosition
     * @param path {string}
     * @param position {number}
     * @param prefix {string}
     * @return {Promise} CompletionEntry[]
     */
    getCompletionsAtPosition(path: string, position: number, prefix: string): Promise<CompletionEntry[]> {
        checkPath(path);
        // FIXME: Promises make it messy to hook for inFlight.
        return this.languageServiceProxy.getCompletionsAtPosition(path, position, prefix);
    }

    /**
     * @method getQuickInfoAtPosition
     * @param path {string}
     * @param position {number}
     * @return {void}
     */
    getQuickInfoAtPosition(path: string, position: number, callback: (err: any, quickInfo: QuickInfo) => any): void {
        checkPath(path);
        this.inFlight++;
        return this.languageServiceProxy.getQuickInfoAtPosition(path, position, (err: any, quickInfo: QuickInfo) => {
            this.inFlight--;
            callback(err, quickInfo);
        });
    }

    /**
     * @method removeScript
     * @param path {string}
     * @param callback {(err: any) => any}
     * @return {void}
     */
    public removeScript(path: string, callback: (err: any) => any): void {
        checkPath(path);
        checkCallback(callback);
        this.inFlight++;
        this.languageServiceProxy.removeScript(path, (err: any) => {
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
     * This appears to be the only function that requires full access to the Editor
     * because it need to call the updateFrontMarkers method or the Renderer.
     */
    private updateMarkerModels(path: string, delta: Delta): void {
        checkPath(path);
        const editor = this.editors[path];
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
                throw new Error(`updateMarkerModels(${path}, ${JSON.stringify(delta)})`);
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
                editor.renderer.updateFrontMarkers();
            }
        }
    }
}
