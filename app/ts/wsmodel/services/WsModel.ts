import * as ng from 'angular';
import addMissingFilesToWorkspace from './addMissingFilesToWorkspace';
import allEditsRaw from './allEditsRaw';
import Annotation from '../../editor/Annotation';
import AutoCompleteCommand from '../../editor/autocomplete/AutoCompleteCommand';
import CompletionEntry from '../../editor/workspace/CompletionEntry';
// FIXME: Code Organization.
import dependenciesMap from '../../services/doodles/dependenciesMap';
import dependencyNames from '../../services/doodles/dependencyNames';
import Delta from '../../editor/Delta';
import Diagnostic from '../../editor/workspace/Diagnostic';
import Disposable from '../../base/Disposable';
import Document from '../../editor/Document';
import Editor from '../../editor/Editor';
import EditSession from '../../editor/EditSession';
// FIXME: Replace by $http
import {get} from '../../editor/lib/net';
import getPosition from '../../editor/workspace/getPosition';
import LanguageServiceProxy from '../../editor/workspace/LanguageServiceProxy';
// FIXME: Code Organization.
import IDoodleConfig from '../../services/doodles/IDoodleConfig';
import IOptionManager from '../../services/options/IOptionManager';
import Position from '../../editor/Position';
import Marker from '../../editor/Marker';
import modeFromName from '../../utils/modeFromName';
import MwEditor from '../../synchronization/MwEditor';
import MwEdits from '../../synchronization/MwEdits';
import MwUnit from '../../synchronization/MwUnit';
import MwWorkspace from '../../synchronization/MwWorkspace';
import OutputFile from '../../editor/workspace/OutputFile';
import QuickInfo from '../../editor/workspace/QuickInfo';
import QuickInfoTooltip from '../../editor/workspace/QuickInfoTooltip';
import QuickInfoTooltipHost from '../../editor/workspace/QuickInfoTooltipHost';
import Range from '../../editor/Range';
import RoomAgent from '../../modules/rooms/services/RoomAgent';
import Shareable from '../../base/Shareable';
import StringShareableMap from '../../collections/StringShareableMap';
import WsFile from './WsFile';
import setOptionalBooleanProperty from '../../services/doodles/setOptionalBooleanProperty';
import setOptionalStringProperty from '../../services/doodles/setOptionalStringProperty';
import setOptionalStringArrayProperty from '../../services/doodles/setOptionalStringArrayProperty';
import UnitListener from './UnitListener';
import WorkspaceCompleter from '../../editor/workspace/WorkspaceCompleter';
import WorkspaceCompleterHost from '../../editor/workspace/WorkspaceCompleterHost';
import removeUnwantedFilesFromWorkspace from './removeUnwantedFilesFromWorkspace';

/**
 * Symbolic constant for the package.json file.
 */
const FILENAME_META = 'package.json';

const systemImports: string[] = ['/jspm_packages/system.js', '/jspm.config.js'];
const workerImports: string[] = systemImports.concat(['/js/ace-workers.js']);
const typescriptServices = ['/js/typescriptServices.js'];

/**
 * The worker implementation for the LanguageServiceProxy.
 */
const workerUrl = '/js/worker.js';
/**
 * The script imports for initializing the LanguageServiceProxy.
 */
const scriptImports = workerImports.concat(typescriptServices);
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

function checkDocument(doc: Document): void {
    if (!(doc instanceof Document)) {
        throw new Error("doc must be a Document.");
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

const DEBOUNCE_DURATION_MILLISECONDS = 100;

function debounce(next: () => any, delay: number) {

    /**
     * The timer handle.
     */
    let timer: number;

    return function(delta: Delta, doc: Document) {
        if (timer) {
            window.clearTimeout(timer);
        }
        timer = setTimeout(function() {
            timer = void 0;
            next();
        }, delay);
    };
}

function uploadFileEditsToRoom(fileId: string, unit: MwUnit, room: RoomAgent) {
    return function() {
        const edits = unit.getEdits(room.id);
        room.setEdits(fileId, edits);
    };
}

/**
 * The workspace data model.
 */
export default class WsModel implements Disposable, MwWorkspace, QuickInfoTooltipHost, Shareable, WorkspaceCompleterHost {

    /**
     * The owner's login.
     */
    owner: string;

    /**
     * 
     */
    gistId: string;

    /**
     * The repository identifier property.
     */
    repo: string;

    /**
     * 
     */
    created_at: string;

    /**
     * 
     */
    updated_at: string;

    /**
     * 
     */
    lastKnownJs: { [path: string]: string } = {};

    /**
     * 
     */
    isCodeVisible = true;

    /**
     * 
     */
    isViewVisible = false;

    /**
     * 
     */
    private files: StringShareableMap<WsFile>;

    /**
     * 
     */
    private trash: StringShareableMap<WsFile>;

    public trace: boolean = false;

    /**
     * Keep track of in-flight requests so that we can prevent cascading requests in an indeterminate state.
     * Increment before an asynchronous call is made.
     * Decrement when the response is received.
     */
    private inFlight: number = 0;

    private quickin: { [path: string]: QuickInfoTooltip } = {};
    private annotationHandlers: { [path: string]: (event: any) => any } = {};

    private refMarkers: number[] = [];

    /**
     * The diagnostics allow us to place markers in the marker layer.
     * This array keeps track of the marker identifiers so that we can
     * remove the existing ones when the time comes to replace them.
     */
    private errorMarkerIds: number[] = [];

    private languageServiceProxy: LanguageServiceProxy;

    private roomListener: UnitListener;

    private langDocumentChangeListenerRemovers: { [path: string]: () => void } = {};
    private roomDocumentChangeListenerRemovers: { [path: string]: () => void } = {};

    /**
     * Slightly unusual reference counting because of:
     * 1) Operating as a service.
     * 2) Handling lifetimes of Editors.
     */
    private refCount = 0;

    public static $inject: string[] = ['options', '$q'];

    constructor(private options: IOptionManager, private $q: ng.IQService) {
        // This will be called once, lazily, when this class is deployed as a singleton service.
        // We do nothing. There is no destructor; it would never be called.
    }

    /**
     * Informs the workspace that we want to reuse it.
     * This method starts the workspace thread.
     * This is the counterpart of the dispose method.
     */
    recycle(callback: (err: any) => any): void {
        console.log(`recycle(), refCount => ${this.refCount}`);
        this.addRef();
        this.inFlight++;
        this.languageServiceProxy.initialize(scriptImports, (err: any) => {
            this.inFlight--;
            if (!err) {
                this.languageServiceProxy.setTrace(false, callback);
            }
            else {
                callback(err);
            }
        });
    }

    /**
     * This is the counterpart of the recycle method.
     */
    dispose(): void {
        this.release();
    }

    addRef(): number {
        if (this.refCount === 0) {
            if (this.files || this.trash) {
                console.warn("Make sure to call dispose()");
            }
            this.files = new StringShareableMap<WsFile>();
            this.trash = new StringShareableMap<WsFile>();
            this.languageServiceProxy = new LanguageServiceProxy(workerUrl);
        }
        this.refCount++;
        return this.refCount;
    }

    release(): number {
        this.refCount--;
        if (this.refCount === 0) {
            this.languageServiceProxy.terminate();
            this.languageServiceProxy = void 0;
            if (this.files) {
                this.files.release();
                this.files = void 0;
            }
            if (this.trash) {
                this.trash.release();
                this.trash = void 0;
            }
        }
        return this.refCount;
    }

    get filesByPath(): { [path: string]: WsFile } {
        const files: { [path: string]: WsFile } = {};
        const paths = this.files.keys;
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            files[path] = this.files.getWeakRef(path);
        }
        return files;
    }

    get trashByPath(): { [path: string]: WsFile } {
        const trash: { [path: string]: WsFile } = {};
        const paths = this.trash.keys;
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            trash[path] = this.trash.getWeakRef(path);
        }
        return trash;
    }

    /**
     * @param url
     * @pram callback
     */
    setDefaultLibrary(url: string, callback: (err: any) => any): void {
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

    setModuleKind(moduleKind: string, callback: (err) => any): void {
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

    setScriptTarget(scriptTarget: string, callback: (err) => any): void {
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

    setTrace(trace: boolean, callback: (err) => any): void {
        checkCallback(callback);
        // We won't bother tracking inFlight for tracing.
        if (this.languageServiceProxy) {
            this.languageServiceProxy.setTrace(trace, callback);
        }
        else {
            callback(new Error("trace is not available."));
        }
    }

    createEditor(): MwEditor {
        // const editor = this.workspace.getEditor(fileName)
        throw new Error("TODO: createEditor");
    }

    deleteEditor(editor: MwEditor): void {
        throw new Error("TODO: deleteEditor");
    }

    /**
     * Attaching the Editor to the workspace enables the IDE features.
     */
    attachEditor(path: string, editor: Editor): void {

        this.addRef();

        console.log(`WsModel.attachEditor(${path})`);
        // Check arguments.
        checkPath(path);
        checkEditor(editor);

        // Idempotency.
        const existing = this.getFileEditor(path);
        if (existing) {
            console.log(`attachEditor ignored because existing => ${existing}`);
            // existing.release();
            return;
        }
        else {
            this.setFileEditor(path, editor);
        }

        // This makes more sense; it is editor specific.
        if (isTypeScript(path)) {
            // Enable auto completion using the Workspace.
            // The command seems to be required on order to enable method completion.
            // However, it has the side-effect of enabling global completions (Ctrl-Space, etc).
            // FIXME: How do we remove these later?
            editor.commands.addCommand(new AutoCompleteCommand());
            editor.completers.push(new WorkspaceCompleter(path, this));

            // Finally, enable QuickInfo.
            const quickInfo = new QuickInfoTooltip(path, editor, this);
            quickInfo.init();
            this.quickin[path] = quickInfo;
        }

        this.attachSession(path, editor.getSession());
    }

    /**
     * Detaching the Editor from the workspace disables the IDE features.
     */
    detachEditor(path: string, editor: Editor): void {
        console.log(`WsModel.detachEditor(${path})`);

        // Check Arguments.
        checkPath(path);
        checkEditor(editor);

        // Idempotency.
        if (!this.getFileEditor(path)) {
            console.log(`WsModel.detachEditor(${path}) ignored`);
            return;
        }
        else {
            this.setFileEditor(path, void 0);
        }

        if (isTypeScript(path)) {
            // Remove QuickInfo
            if (this.quickin[path]) {
                const quickInfo = this.quickin[path];
                quickInfo.terminate();
                delete this.quickin[path];
            }
        }

        this.detachSession(path, editor.getSession());
        this.release();
    }

    private attachSession(path: string, session: EditSession): void {
        console.log("attachSession");
        checkPath(path);
        checkSession(session);

        if (isTypeScript(path)) {
            if (!this.annotationHandlers[path]) {
                // When the LanguageMode has completed syntax analysis, it emits annotations.
                // This is our cue to begin semantic analysis and make use of transpiled files.
                const annotationsHandler = (event: { data: Annotation[]; type: string }) => {
                    if (this.inFlight === 0) {
                        this.semanticDiagnostics();
                        this.outputFiles();
                    }
                    else {
                        console.warn(`Ignoring 'annotations' event because inFlight => ${this.inFlight}`);
                    }
                };
                session.on('annotations', annotationsHandler);
                this.annotationHandlers[path] = annotationsHandler;
            }
            else {
                console.warn("attachSession ignored");
            }
        }
    }

    private detachSession(path: string, session: EditSession) {
        console.log("detachSession");
        checkPath(path);
        checkSession(session);

        if (isTypeScript(path)) {
            // Remove Annotation Handlers.
            if (this.annotationHandlers[path]) {
                const annotationHandler = this.annotationHandlers[path];
                session.off('annotations', annotationHandler);
                delete this.annotationHandlers[path];
            }
            else {
                console.warn("detachSession ignored");
            }
        }
    }

    /**
     * Ends monitoring the Document at the specified path for changes and removes the script from the LanguageService.
     */
    beginDocumentMonitoring(path: string, callback: (err) => any): void {
        console.log(`beginDocumentMonitoring(${path})`);
        checkPath(path);
        checkCallback(callback);

        const doc = this.getFileDocument(path);
        try {
            checkDocument(doc);

            if (isTypeScript(path)) {
                if (!this.langDocumentChangeListenerRemovers[path]) {
                    const changeHandler = (delta: Delta, source: Document) => {
                        this.inFlight++;
                        this.languageServiceProxy.applyDelta(path, delta, (err: any) => {
                            this.inFlight--;
                            if (!err) {
                                this.updateFileSessionMarkerModels(path, delta);
                                this.updateFileEditorFrontMarkers(path);
                            }
                            else {
                                console.warn(`applyDelta ${JSON.stringify(delta, null, 2)} to '${path}' failed: ${err}`);
                            }
                        });
                    };
                    this.langDocumentChangeListenerRemovers[path] = doc.addChangeListener(changeHandler);
                }

                // Ensure the script in the language service.
                this.ensureScript(path, doc.getValue(), callback);
            }
        }
        finally {
            doc.release();
        }
    }

    /**
     * Ends monitoring the Document at the specified path for changes and removes the script from the LanguageService.
     */
    endDocumentMonitoring(path: string, callback: (err) => any) {
        console.log(`endDocumentMonitoring(${path})`);
        checkPath(path);
        checkCallback(callback);

        const doc = this.getFileDocument(path);
        try {
            checkDocument(doc);

            if (isTypeScript(path)) {
                if (this.langDocumentChangeListenerRemovers[path]) {
                    this.langDocumentChangeListenerRemovers[path]();
                    delete this.langDocumentChangeListenerRemovers[path];

                    // Remove the script from the language service.
                    this.removeScript(path, callback);
                }
                else {
                    setTimeout(callback, 0);
                }
            }
            else {
                setTimeout(callback, 0);
            }
        }
        finally {
            doc.release();
        }
    }

    /**
     * 
     */
    ensureScript(path: string, content: string, callback: (err) => any): void {
        console.log(`ensureScript(${path})`);
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
     * 
     */
    removeScript(path: string, callback: (err) => any) {
        console.log(`removeScript(${path})`);
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
     * 
     */
    public semanticDiagnostics(): void {
        const paths = this.getFileSessionPaths();
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            if (isTypeScript(path)) {
                const session = this.getFileSession(path);
                try {
                    this.semanticDiagnosticsForSession(path, session);
                }
                finally {
                    session.release();
                }
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
     *
     */
    public outputFiles(): void {
        const paths = this.getFileSessionPaths();
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            if (isTypeScript(path)) {
                const session = this.getFileSession(path);
                try {
                    this.outputFilesForSession(path, session);
                }
                finally {
                    session.release();
                }
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

    get author(): string {
        try {
            if (this.existsPackageJson()) {
                const pkgInfo = this.packageInfo;
                if (pkgInfo) {
                    return pkgInfo.author;
                }
                else {
                    return void 0;
                }
            }
            else {
                return void 0;
            }
        }
        catch (e) {
            console.warn(e);
            return void 0;
        }
    }
    set author(author: string) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: IDoodleConfig = JSON.parse(file.getText());
            setOptionalStringProperty('author', author, metaInfo);
            file.setText(JSON.stringify(metaInfo, null, 2));
        }
        finally {
            file.release();
        }
    }
    get dependencies(): string[] {
        try {
            if (this.existsPackageJson()) {
                const pkgInfo = this.packageInfo;
                if (pkgInfo) {
                    const dependencyMap = this.packageInfo.dependencies;
                    return dependencyNames(dependencyMap);
                }
                else {
                    return [];
                }
            }
            else {
                return [];
            }
        }
        catch (e) {
            console.warn(e);
            return [];
        }
    }
    set dependencies(dependencies: string[]) {
        try {
            const file = this.ensurePackageJson();
            try {
                const metaInfo: IDoodleConfig = JSON.parse(file.getText());
                metaInfo.dependencies = dependenciesMap(dependencies, this.options);
                file.setText(JSON.stringify(metaInfo, null, 2));
            }
            finally {
                file.release();
            }
        }
        catch (e) {
            console.warn(`Unable to set dependencies property in file '${FILENAME_META}'.`);
        }
    }
    get description(): string {
        try {
            if (this.existsPackageJson()) {
                const pkgInfo = this.packageInfo;
                if (pkgInfo) {
                    return pkgInfo.description;
                }
                else {
                    return void 0;
                }
            }
            else {
                return void 0;
            }
        }
        catch (e) {
            console.warn(e);
            return void 0;
        }
    }
    set description(description: string) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: IDoodleConfig = JSON.parse(file.getText());
            setOptionalStringProperty('description', description, metaInfo);
            file.setText(JSON.stringify(metaInfo, null, 2));
        }
        finally {
            file.release();
        }
    }
    get keywords(): string[] {
        try {
            if (this.existsPackageJson()) {
                const pkgInfo = this.packageInfo;
                if (pkgInfo) {
                    return this.packageInfo.keywords;
                }
                else {
                    return [];
                }
            }
            else {
                return [];
            }
        }
        catch (e) {
            console.warn(e);
            return [];
        }
    }
    set keywords(keywords: string[]) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: IDoodleConfig = JSON.parse(file.getText());
            setOptionalStringArrayProperty('keywords', keywords, metaInfo);
            file.setText(JSON.stringify(metaInfo, null, 2));
        }
        finally {
            file.release();
        }
    }
    get name(): string {
        if (this.existsPackageJson()) {
            const pkgInfo = this.packageInfo;
            if (pkgInfo) {
                return pkgInfo.name;
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    set name(name: string) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: IDoodleConfig = JSON.parse(file.getText());
            metaInfo.name = name;
            file.setText(JSON.stringify(metaInfo, null, 2));
        }
        catch (e) {
            console.warn(`Unable to set name property in file '${FILENAME_META}'.`);
        }
        finally {
            file.release();
        }
    }
    get operatorOverloading(): boolean {
        if (this.existsPackageJson()) {
            const pkgInfo = this.packageInfo;
            if (pkgInfo) {
                return pkgInfo.operatorOverloading ? true : false;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    set operatorOverloading(operatorOverloading: boolean) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: IDoodleConfig = JSON.parse(file.getText());
            setOptionalBooleanProperty('operatorOverloading', operatorOverloading, metaInfo);
            file.setText(JSON.stringify(metaInfo, null, 2));
        }
        catch (e) {
            console.warn(`Unable to set operatorOverloading property in file '${FILENAME_META}'.`);
        }
        finally {
            file.release();
        }
    }
    get version(): string {
        if (this.existsPackageJson()) {
            return this.packageInfo.version;
        }
        else {
            return void 0;
        }
    }
    set version(version: string) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: IDoodleConfig = JSON.parse(file.getText());
            metaInfo.version = version;
            file.setText(JSON.stringify(metaInfo, null, 2));
        }
        finally {
            file.release();
        }
    }
    protected destructor(): void {
        // This may never be called when this class is deployed as a singleton service.
        // console.lg("WsModel.destructor");
    }
    newFile(path: string): WsFile {
        const mode = modeFromName(path);
        if (!this.existsFile(path)) {
            const trashedFile = this.trash.get(path);
            if (!trashedFile) {
                const file = new WsFile(this);
                file.setText("");
                file.mode = mode;
                if (!this.files) {
                    this.files = new StringShareableMap<WsFile>();
                }
                // The file is captured by the files collection (incrementing the reference count).
                this.files.put(path, file);
                this.beginDocumentMonitoring(path, (err) => {
                    // FIXME: We should be returning the file in the callback.
                });
                // We return the other reference.
                return file;
            }
            else {
                this.restoreFileFromTrash(path);
                trashedFile.mode = mode;
                this.beginDocumentMonitoring(path, (err) => {
                    // FIXME: We should be returning the file in the callback.
                });
                return trashedFile;
            }
        }
        else {
            throw new Error(`${path} already exists. The path must be unique.`);
        }
    }
    deleteFile(path: string): void {
        const file = this.files.getWeakRef(path);
        if (file) {
            // Determine whether the file exists in GitHub so that we can DELETE it upon upload.
            // Use the raw_url as the sentinel. Keep it in trash for later deletion.
            this.endDocumentMonitoring(path, (err) => {
                if (file.raw_url) {
                    this.moveFileToTrash(path);
                }
                else {
                    // It's a file that does not exist on GitHub.
                    this.files.remove(path).release();
                    delete this.lastKnownJs[path];
                }
            });
        }
        else {
            console.warn(`deleteFile(${path}), ${path} was not found.`);
        }
    }
    existsFile(path: string): boolean {
        return this.files.exists(path);
    }
    openFile(path: string): void {
        const file = this.files.getWeakRef(path);
        if (file) {
            // The UI should see this change, ng-if enabling the 'editor' directive which
            // creates an Editor, which requests an EditSession, notifies the controller
            // of its creation, eventually getting back to the workspace and the file.
            file.isOpen = true;
        }
        else {
            // Do nothing
        }
    }

    /**
     * 
     */
    renameFile(oldName: string, newName: string): void {
        const mode = modeFromName(newName);
        if (!mode) {
            throw new Error(`${newName} is not a recognized language.`);
        }
        // Make sure that the file we want to re-path really does exist.
        const oldFile = this.files.getWeakRef(oldName);
        if (oldFile) {
            if (!this.existsFile(newName)) {
                // Determine whether we can recycle a file from trash or must create a new file.
                if (!this.existsFileInTrash(newName)) {

                    // We must create a new file.
                    const newFile = this.newFile(newName);

                    // Initialize properties.
                    newFile.setText(oldFile.getText());
                    newFile.isOpen = oldFile.isOpen;
                    newFile.selected = oldFile.selected;

                    // Make it clear that this file did not come from GitHub.
                    newFile.raw_url = void 0;
                    // newFile.size = void 0;
                    // newFile.truncated = void 0;
                    // newFile.type = void 0;

                    // Initialize properties that depend upon the new path.
                    newFile.mode = mode;

                    this.files.putWeakRef(newName, newFile);
                }
                else {
                    // We can recycle a file from trash.
                    this.restoreFileFromTrash(newName);
                    const theFile = this.files.getWeakRef(newName);
                    // Initialize properties that depend upon the new path.
                    theFile.mode = mode;
                }
                // Delete the file by the old path.
                this.deleteFile(oldName);
            }
            else {
                throw new Error(`${newName} already exists. The new path must be unique.`);
            }
        }
        else {
            throw new Error(`${oldName} does not exist. The old path must be the path of an existing file.`);
        }
    }
    selectFile(path: string): void {
        const file = this.files.getWeakRef(path);
        if (file) {
            if (file.isOpen) {
                const paths = this.files.keys;
                const iLen = paths.length;
                for (let i = 0; i < iLen; i++) {
                    const file = this.files.getWeakRef(paths[i]);
                    if (file.isOpen) {
                        file.selected = paths[i] === path;
                    }
                }
            }
            else {
                // Do nothing
            }
        }
        else {
            // Do nothing.
        }
    }
    closeFile(path: string): void {
        const file = this.files.getWeakRef(path);
        if (file) {
            // We assume someone is watching this property, ready to pounce.
            // TODO: Replace with openPending flag?
            file.isOpen = false;
            file.selected = false;
        }
        else {
            // Do nothing
        }

        // Select the first open file that we find.
        this.deselectAll();

        const paths = this.files.keys;
        const iLen = paths.length;
        for (let i = 0; i < iLen; i++) {
            const file = this.files.getWeakRef(paths[i]);
            if (file.isOpen) {
                file.selected = true;
                return;
            }
        }
    }

    emptyTrash(): void {
        throw new Error("TODO: WsModel.emptyTrash");
    }

    existsFileInTrash(path: string): boolean {
        return this.trash.exists(path);
    }

    /**
     *
     */
    getPreviewFile(): string {
        const paths = this.files.keys;
        const iLen = paths.length;
        for (let i = 0; i < iLen; i++) {
            const path = paths[i];
            if (this.files.getWeakRef(path).preview) {
                return path;
            }
        }
        return void 0;
    }

    getPreviewFileOrBestAvailable(): string {
        const previewFile = this.getPreviewFile();
        if (previewFile) {
            return previewFile;
        }
        else {
            let bestFile: string;
            const paths = this.files.keys;
            const iLen = paths.length;
            for (let i = 0; i < iLen; i++) {
                const path = paths[i];
                const mode = modeFromName(path);
                if (mode === 'HTML') {
                    if (path === 'index.html') {
                        return path;
                    }
                    else if (path.toLowerCase() === 'specrunner.html') {
                        bestFile = path;
                    }
                    else if (typeof bestFile === 'undefined') {
                        bestFile = path;
                    }
                    else {
                        // Ignore the file.
                    }
                }
                else {
                    // We don't consider other file types for now.
                }
            }
            return bestFile;
        }
    }

    /**
     * Finds the file at the specified path.
     *
     * @returns The file at the specified path.
     */
    findFileByPath(path: string): WsFile {
        if (this.files) {
            return this.files.get(path);
        }
        else {
            return void 0;
        }
    }
    getFileWeakRef(path: string): WsFile {
        if (this.files) {
            return this.files.getWeakRef(path);
        }
        else {
            return void 0;
        }
    }
    getFileEditor(path: string): Editor {
        if (this.files) {
            // TODO: Neet to implement getSession
            const file = this.files.getWeakRef(path);
            if (file) {
                return file.getEditor();
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    getFileEditorPaths(): string[] {
        const all = this.files.keys;
        return all.filter((path) => {
            const file = this.files.getWeakRef(path);
            return file.hasEditor();
        });
    }
    setFileEditor(path: string, editor: Editor): void {
        if (this.files) {
            const file = this.files.getWeakRef(path);
            if (file) {
                file.setEditor(editor);
            }
        }
    }
    getFileSession(path: string): EditSession {
        if (this.files) {
            // TODO: Neet to implement getSession
            const file = this.files.getWeakRef(path);
            if (file) {
                return file.getSession();
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    getFileSessionPaths(): string[] {
        const all = this.files.keys;
        return all.filter((path) => {
            const file = this.files.getWeakRef(path);
            return file.hasSession();
        });
    }
    setFileSession(path: string, session: EditSession) {
        if (this.files) {
            const file = this.files.getWeakRef(path);
            if (file) {
                file.setSession(session);
            }
        }
    }
    getFileDocument(path: string): Document {
        if (this.files) {
            // TODO: Neet to implement getSession
            const file = this.files.getWeakRef(path);
            if (file) {
                return file.getDocument();
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    getFileDocumentPaths(): string[] {
        const all = this.files.keys;
        return all.filter((path) => {
            const file = this.files.getWeakRef(path);
            return file.hasDocument();
        });
    }
    setFileDocument(path: string, doc: Document) {
        if (this.files) {
            const file = this.files.getWeakRef(path);
            if (file) {
                file.setDocument(doc);
            }
        }
    }
    setPreviewFile(path: string): void {
        const file = this.files.getWeakRef(path);
        if (file) {
            const paths = this.files.keys;
            const iLen = paths.length;
            for (let i = 0; i < iLen; i++) {
                this.files.getWeakRef(paths[i]).preview = false;
            }
            file.preview = true;
        }
        else {
            // Do nothing
        }
    }

    /**
     * 
     */
    /*
    updateStorage(): void {
        // FIXME: Let it go until we need to create stuff.
        throw new Error("TODO: WsModel.updateStorage");
    }
    */

    /**
     * Determines whether this workspace has a package.json file.
     */
    private existsPackageJson(): boolean {
        return this.existsFile(FILENAME_META);
    }

    /**
     * 
     */
    get packageInfo(): IDoodleConfig {
        try {
            // Beware: We could have a package.json that doesn't parse.
            // We must ensure that the user can recover the situation.
            const file = this.ensurePackageJson();
            const text = file.getText();
            file.release();
            return JSON.parse(text);
        }
        catch (e) {
            console.warn(`Unable to parse file '${FILENAME_META}' as JSON.`);
            const file = this.ensurePackageJson();
            const text = file.getText();
            file.release();
            console.warn(text);
            return void 0;
        }
    }

    private deselectAll() {
        const paths = this.files.keys;
        const iLen = paths.length;
        for (let i = 0; i < iLen; i++) {
            const file = this.files.getWeakRef(paths[i]);
            file.selected = false;
        }
    }

    private ensurePackageJson(): WsFile {
        return this.ensureFile(FILENAME_META, '{}');
    }

    /**
     *
     */
    private ensureFile(path: string, content: string): WsFile {
        if (!this.existsFile(path)) {
            const file = this.newFile(path);
            file.setText(content);
            file.mode = modeFromName(path);
            return file;
        }
        else {
            return this.findFileByPath(path);
        }
    }

    private moveFileToTrash(path: string): void {
        const unwantedFile = this.files.getWeakRef(path);
        if (unwantedFile) {
            // Notice that the conflict could be with a TRASHED file.
            const conflictFile = this.trash.getWeakRef(path);
            if (!conflictFile) {
                // There is no conflict, proceed with the move.
                this.trash.putWeakRef(path, unwantedFile);
                this.files.remove(path);
                if (this.existsFile(path)) {
                    throw new Error(`${path} was not physically deleted from files.`);
                }
            }
            else {
                throw new Error(`${path} cannot be moved to trash because of a naming conflict with an existing file.`);
            }
        }
        else {
            throw new Error(`${path} cannot be moved to trash because it does not exist.`);
        }
    }

    private restoreFileFromTrash(path: string): void {
        const wantedFile = this.trash.getWeakRef(path);
        if (wantedFile) {
            const conflictFile = this.files.getWeakRef(path);
            if (!conflictFile) {
                this.trash.remove(path);
                this.files.putWeakRef(path, wantedFile);
            }
            else {
                throw new Error(`${path} cannot be restored from trash because of a naming conflict with an existing file.`);
            }
        }
        else {
            throw new Error(`${path} cannot be restored from trash because it does not exist.`);
        }
    }
    connectToRoom(room: RoomAgent) {
        if (room) {
            // Enumerate the editors in the workspace and add them to the node.
            // This will enable the node to get/set the editor value, diff and apply patches.
            const fileNames = this.files.keys;
            for (let i = 0; i < fileNames.length; i++) {
                const fileName = fileNames[i];
                const file = this.files.getWeakRef(fileName);
                // Create the synchronization node associated with the workspace.
                // This will enable the node to create and destroy editors.
                file.unit = new MwUnit(this);
                file.unit.setEditor(file);
            }

            // Add a listener to the room agent so that edits broadcast from the room are sent to the node.
            this.roomListener = new UnitListener(this);
            room.addListener(this.roomListener);

            // Add listeners for editor changes. These will begin the flow of diffs to the server.
            // We debounce the change events so that the diff is trggered when things go quiet for a second.
            for (let i = 0; i < fileNames.length; i++) {
                const fileName = fileNames[i];
                const doc = this.getFileDocument(fileName);
                try {
                    const file = this.files.getWeakRef(fileName);
                    const unit = file.unit;
                    const changeHandler = debounce(uploadFileEditsToRoom(fileName, unit, room), DEBOUNCE_DURATION_MILLISECONDS);
                    this.roomDocumentChangeListenerRemovers[fileName] = doc.addChangeListener(changeHandler);
                }
                finally {
                    doc.release();
                }
            }
        }
        else {
            throw new Error("Must have a workspace and a room.");
        }
    }
    disconnectFromRoom(room: RoomAgent) {
        // Remove listeners on the editor for changes.
        const fileNames = this.files.keys;
        for (let i = 0; i < fileNames.length; i++) {
            const fileName = fileNames[i];
            const doc = this.getFileDocument(fileName);
            try {
                this.roomDocumentChangeListenerRemovers[fileName]();
                delete this.roomDocumentChangeListenerRemovers[fileName];
            }
            finally {
                doc.release();
            }
        }
        // remove the listener on the room agent.
        room.removeListener(this.roomListener);
        this.roomListener = void 0;
        // TODO: We can purge all the units.
    }
    uploadToRoom(room: RoomAgent) {
        if (room) {
            const fileIds = this.files.keys;
            for (let i = 0; i < fileIds.length; i++) {
                const fileId = fileIds[i];
                const file = this.files.getWeakRef(fileId);
                const unit = file.unit;
                const edits: MwEdits = unit.getEdits(room.id);
                room.setEdits(fileId, edits);
            }
        }
        else {
            console.warn("We appear to be missing a room");
        }
    }
    downloadFromRoom(room: RoomAgent) {
        if (room) {
            // This could also be done through the rooms service.
            room.download((err, files: { [fileName: string]: MwEdits }) => {
                if (!err) {
                    // Verify that all of the edits are Raw to begin with.
                    if (allEditsRaw(files)) {
                        // We make a new Doodle to accept the downloaded workspace.
                        // FIXME: Can we wait for the therad to stop?
                        this.dispose();
                        this.recycle((err) => {
                            addMissingFilesToWorkspace(this, files);
                            // This will not be required since we are starting with a new Doodle.
                            removeUnwantedFilesFromWorkspace(this, files);
                            // Save the downloaded edits for when the editors come online?
                            // this.files = files;
                        });
                    }
                    else {
                        console.warn(JSON.stringify(files, null, 2));
                    }
                }
                else {
                    console.warn(`Unable to download workspace: ${err}`);
                }
            });
            // doodle.files
        }
        else {
            console.warn("We appear to be missing a room");
        }
    }

    /**
     * This appears to be the only function that requires full access to the Editor
     * because it need to call the updateFrontMarkers method or the Renderer.
     */
    private updateFileSessionMarkerModels(path: string, delta: Delta): void {
        checkPath(path);
        const session: EditSession = this.getFileSession(path);
        if (session) {
            try {
                const action = delta.action;
                const markers: { [id: number]: Marker } = session.getMarkers(true);
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
                }
            }
            finally {
                session.release();
            }
        }
        else {
            // There is no editor (but there may be a session.)
        }
    }

    updateFileEditorFrontMarkers(path: string) {
        const editor = this.getFileEditor(path);
        if (editor) {
            editor.renderer.updateFrontMarkers();
        }
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
}
