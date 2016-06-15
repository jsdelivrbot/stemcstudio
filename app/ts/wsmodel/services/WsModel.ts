import * as ng from 'angular';
import addMissingFilesToWorkspace from './addMissingFilesToWorkspace';
import allEditsRaw from './allEditsRaw';
import Annotation from '../../editor/Annotation';
import AutoCompleteCommand from '../../editor/autocomplete/AutoCompleteCommand';
import CompletionEntry from '../../editor/workspace/CompletionEntry';
import copyWorkspaceToDoodle from '../../mappings/copyWorkspaceToDoodle';
// FIXME: Code Organization.
import dependenciesMap from '../../services/doodles/dependenciesMap';
import dependencyNames from '../../services/doodles/dependencyNames';
import Delta from '../../editor/Delta';
import Diagnostic from '../../editor/workspace/Diagnostic';
import Disposable from '../../base/Disposable';
import Document from '../../editor/Document';
import Editor from '../../editor/Editor';
import EditSession from '../../editor/EditSession';
import EventBus from './EventBus';
// FIXME: Replace by $http
import {get} from '../../editor/lib/net';
import getPosition from '../../editor/workspace/getPosition';
import LanguageServiceProxy from '../../editor/workspace/LanguageServiceProxy';
// FIXME: Code Organization.
import IDoodleConfig from '../../services/doodles/IDoodleConfig';
import IDoodleManager from '../../services/doodles/IDoodleManager';
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

/**
 * Converts the metaInfo to a string using JSON.stringify and append a newline character.
 */
function stringifyInfo(metaInfo: IDoodleConfig): string {
    return JSON.stringify(metaInfo, null, 2) + '\n';
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

/**
 * Synchronize after 0.25 seconds of inactivity.
 */
const SYNCH_DELAY_MILLISECONDS = 250;

/**
 * Persist to Local Storage after 2 seconds of inactivity.
 */
const STORE_DELAY_MILLISECONDS = 2000;

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

function uploadFileEditsToRoom(path: string, unit: MwUnit, room: RoomAgent) {
    return function() {
        const edits = unit.getEdits(room.id);
        room.setEdits(path, edits);
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
     * Files in the workspace.
     */
    private files: StringShareableMap<WsFile>;

    /**
     * Files that have been deleted (used to support updating a Gist)
     */
    private trash: StringShareableMap<WsFile>;

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

    /**
     * Listeners added to the document for the LanguageService.
     */
    private langDocumentChangeListenerRemovers: { [path: string]: () => void } = {};
    /**
     * Listeners added to the document for Synchronization.
     */
    private roomDocumentChangeListenerRemovers: { [path: string]: () => void } = {};
    /**
     * Listeners added to the Document for Local Storage.
     */
    private saveDocumentChangeListenerRemovers: { [path: string]: () => void } = {};

    /**
     * Slightly unusual reference counting because of:
     * 1) Operating as a service.
     * 2) Handling lifetimes of Editors.
     */
    private refCount = 0;

    /**
     * 
     */
    private windingDown: ng.IPromise<any>;

    /**
     * 
     */
    private eventBus: EventBus<any, WsModel> = new EventBus<any, WsModel>(this);

    public static $inject: string[] = ['options', '$q', 'doodles'];

    constructor(private options: IOptionManager, private $q: ng.IQService, private doodles: IDoodleManager) {
        // This will be called once, lazily, when this class is deployed as a singleton service.
        // We do nothing. There is no destructor; it would never be called.
    }

    /**
     * Informs the workspace that we want to reuse it.
     * This method starts the workspace thread.
     * This is the counterpart of the dispose method.
     */
    recycle(callback: (err: any) => any): void {
        if (this.windingDown) {
            // console.lg("windingDown...");
            this.windingDown.then(() => {
                this.windingDown = void 0;
                this.recycle(callback);
            }).catch((reason) => {
                console.warn(`Big Trouble in Little STEMCstudio: ${JSON.stringify(reason)}`);
            });
        }
        else {
            // console.lg(`recycle(), refCount => ${this.refCount}`);
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
                console.warn("Make sure to call dispose() or release()");
            }
            this.files = new StringShareableMap<WsFile>();
            this.trash = new StringShareableMap<WsFile>();
            this.languageServiceProxy = new LanguageServiceProxy(workerUrl);
            this.eventBus.reset();
        }
        this.refCount++;
        // console.lg(`WsModel.addRef() refCount => ${this.refCount}`);
        return this.refCount;
    }

    release(): number {
        this.refCount--;
        // console.lg(`WsModel.release() refCount => ${this.refCount}`);
        if (this.refCount === 0) {
            const deferred = this.$q.defer();
            this.endMonitoring(() => {
                this.eventBus.reset();
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
                deferred.resolve();
            });
            this.windingDown = deferred.promise;
        }
        return this.refCount;
    }

    /**
     * Notifies the callback when the specified event happens.
     * The function returned may be used to remove the watch.
     */
    watch<T>(eventName: string, callback: (event: T, source: WsModel) => any) {
        return this.eventBus.watch(eventName, callback);
    }

    /**
     * Determines whether this instance is still incapable of accepting method calls.
     */
    isZombie(): boolean {
        return this.refCount === 0;
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

    /**
     * A map of path to WsFile that is not reference counted.
     */
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

        // The user may elect to open an editor but then leave the workspace as the editor is opening.
        if (this.isZombie()) {
            // console.lg("WsModel.attachEditor ignored because isZombie");
            return;
        }

        this.addRef();

        // console.lg(`WsModel.attachEditor(${path})`);

        checkPath(path);
        checkEditor(editor);

        // Idempotency.
        const existing = this.getFileEditor(path);
        if (existing) {
            console.warn(`attachEditor(${path}) ignored because existing`);
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

        if (this.isZombie()) {
            // console.lg("WsModel.detachEditor Open because isZombie");
            return;
        }
        try {
            // console.lg(`WsModel.detachEditor(${path})`);

            checkPath(path);
            checkEditor(editor);

            this.setFileEditor(path, void 0);

            if (isTypeScript(path)) {
                // Remove QuickInfo
                if (this.quickin[path]) {
                    const quickInfo = this.quickin[path];
                    quickInfo.terminate();
                    delete this.quickin[path];
                }
            }

            this.detachSession(path, editor.getSession());
        }
        finally {
            this.release();
        }
    }

    private attachSession(path: string, session: EditSession): void {
        // console.lg(`attachSession(${path})`);
        checkPath(path);

        if (session) {
            checkSession(session);
        }
        else {
            return;
        }

        if (isTypeScript(path)) {
            if (!this.annotationHandlers[path]) {
                // When the LanguageMode has completed syntax analysis, it emits annotations.
                // This is our cue to begin semantic analysis and make use of transpiled files.
                const annotationsHandler = (event: { data: Annotation[]; type: string }) => {
                    if (this.inFlight === 0) {
                        this.semanticDiagnostics();
                    }
                };
                session.on('annotations', annotationsHandler);
                this.annotationHandlers[path] = annotationsHandler;
            }
            else {
                console.warn(`attachSession(${path}) ignored because there is already an annotation handler.`);
            }
        }
    }

    private detachSession(path: string, session: EditSession) {
        // console.lg(`detachSession(${path})`);
        checkPath(path);

        if (session) {
            checkSession(session);
        }
        else {
            return;
        }

        if (isTypeScript(path)) {
            // Remove Annotation Handlers.
            if (this.annotationHandlers[path]) {
                const annotationHandler = this.annotationHandlers[path];
                session.off('annotations', annotationHandler);
                delete this.annotationHandlers[path];
            }
            else {
                console.warn(`detachSession(${path}) ignored because there is no annotation handler.`);
            }
        }
    }

    /**
     * Ends monitoring the Document at the specified path for changes and removes the script from the LanguageService.
     */
    beginDocumentMonitoring(path: string, callback: (err) => any): void {
        // console.lg(`beginDocumentMonitoring(${path})`);
        checkPath(path);
        checkCallback(callback);

        const doc = this.getFileDocument(path);
        try {
            checkDocument(doc);

            // Monitoring for Language Analysis.
            if (isTypeScript(path)) {
                if (!this.langDocumentChangeListenerRemovers[path]) {
                    const changeHandler = (delta: Delta, source: Document) => {
                        this.inFlight++;
                        this.languageServiceProxy.applyDelta(path, delta, (err: any) => {
                            this.inFlight--;
                            if (!err) {
                                this.updateFileSessionMarkerModels(path, delta);
                                this.updateFileEditorFrontMarkers(path);
                                this.outputFilesForPath(path);
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

            // Monitoring for Local Storage.
            const storageHandler = debounce(() => { this.updateStorage(); }, STORE_DELAY_MILLISECONDS);
            this.saveDocumentChangeListenerRemovers[path] = doc.addChangeListener(storageHandler);
        }
        finally {
            doc.release();
        }
    }

    /**
     * Ends monitoring the Document at the specified path for changes and removes the script from the LanguageService.
     */
    endDocumentMonitoring(path: string, callback: (err) => any) {
        // console.lg(`endDocumentMonitoring(${path})`);
        checkPath(path);
        checkCallback(callback);

        const doc = this.getFileDocument(path);
        try {
            checkDocument(doc);

            // Monitoring for Language Analysis.
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

            // Monitoring for Local Storage.
            if (this.saveDocumentChangeListenerRemovers[path]) {
                this.saveDocumentChangeListenerRemovers[path]();
                delete this.saveDocumentChangeListenerRemovers[path];
            }
        }
        finally {
            doc.release();
        }
    }

    private endMonitoring(callback: () => any) {
        const paths = Object.keys(this.langDocumentChangeListenerRemovers);
        const iLen = paths.length;
        let outstanding = iLen;
        if (outstanding > 0) {
            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                this.endDocumentMonitoring(path, function(err) {
                    outstanding--;
                    if (outstanding === 0) {
                        callback();
                    }
                });
            }
        }
        else {
            setTimeout(callback, 0);
        }
    }

    /**
     * 
     */
    ensureScript(path: string, content: string, callback: (err) => any): void {
        // console.lg(`ensureScript(${path})`);
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
        // console.lg(`removeScript(${path})`);
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

        if (session) {
            checkSession(session);
        }
        else {
            return;
        }

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
        const paths = this.getFileDocumentPaths();
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            if (isTypeScript(path)) {
                this.outputFilesForPath(path);
            }
        }
    }

    private outputFilesForPath(path: string): void {

        checkPath(path);

        this.inFlight++;
        this.languageServiceProxy.getOutputFiles(path, (err: any, outputFiles: OutputFile[]) => {
            this.inFlight--;
            if (!err) {
                this.eventBus.emit('outputFiles', { data: outputFiles });
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
            file.setText(stringifyInfo(metaInfo));
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
                file.setText(stringifyInfo(metaInfo));
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
            file.setText(stringifyInfo(metaInfo));
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
            file.setText(stringifyInfo(metaInfo));
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
            file.setText(stringifyInfo(metaInfo));
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
            file.setText(stringifyInfo(metaInfo));
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
            file.setText(stringifyInfo(metaInfo));
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

    /**
     * 1. Ends monitoring of the Document at the specified path.
     * 2. Removes the file from the workspace.
     * 3. Updates Local Storage.
     */
    deleteFile(path: string, callback: (reason: Error) => any): void {
        const file = this.files.getWeakRef(path);
        if (file) {
            // Determine whether the file exists in GitHub so that we can DELETE it upon upload.
            // Use the raw_url as the sentinel. Keep it in trash for later deletion.
            this.endDocumentMonitoring(path, (err) => {
                if (file.existsInGitHub) {
                    // console.lg(`File ${path} is being moved to the trash.`);
                    this.moveFileToTrash(path);
                    this.updateStorage();
                    callback(void 0);
                }
                else {
                    // It's a file that does not exist on GitHub.
                    // console.lg(`File ${path} is being dropped.`);
                    this.files.remove(path).release();
                    delete this.lastKnownJs[path];
                    this.updateStorage();
                    callback(void 0);
                }
            });
        }
        else {
            setTimeout(() => {
                callback(new Error(`deleteFile(${path}), ${path} was not found.`));
            }, 0);
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
            this.updateStorage();
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
                    newFile.existsInGitHub = false;

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
                // FIXME:
                this.deleteFile(oldName, (reason: Error) => {
                    console.warn("TODO: Rename");
                });
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
            this.updateStorage();
        }
    }

    closeFile(path: string): void {
        const file = this.files.getWeakRef(path);
        if (file) {
            // The user interface responds to the isOpen flag.
            file.isOpen = false;

            // A file which is closed can't be selected.
            if (file.selected) {
                file.selected = false;

                // Select the first open file that we find.
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
            this.updateStorage();
        }
    }

    markAllFilesAsInGitHub(): void {
        const paths = this.files.keys;
        const iLen = paths.length;
        for (let i = 0; i < iLen; i++) {
            const path = paths[i];
            const file = this.files.getWeakRef(path);
            file.existsInGitHub = true;
        }
    }

    emptyTrash(): void {
        const paths = this.trash.keys;
        const iLen = paths.length;
        for (let i = 0; i < iLen; i++) {
            const path = paths[i];
            const file = this.trash.remove(path);
            file.release();
        }
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

    /**
     * Return the Document for the specified file. This reference must be released when no longer required.
     */
    getFileDocument(path: string): Document {
        if (this.files) {
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
     * Updates Local Storage with this workspace as the current doodle.
     */
    updateStorage(): void {
        if (!this.isZombie()) {
            const doodle = this.doodles.current();
            copyWorkspaceToDoodle(this, doodle);
            this.doodles.updateStorage();
        }
    }

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
            return void 0;
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
                this.trashPut(path);
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

    public trashPut(path: string): void {
        // TODO: Simplify trash down to a set of paths.
        const placeholder = new WsFile(this);
        placeholder.existsInGitHub = true;
        this.trash.putWeakRef(path, placeholder);
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
            const paths = this.files.keys;
            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                const file = this.files.getWeakRef(path);
                // Create the synchronization node associated with the workspace.
                // This will enable the node to create and destroy editors.
                file.unit = new MwUnit(this);
                file.unit.setEditor(file);
            }

            // Add a listener to the room agent so that edits broadcast from the room are sent to the node.
            this.roomListener = new UnitListener(this);
            room.addListener(this.roomListener);

            // Add listeners for document changes. These will begin the flow of diffs to the server.
            // We debounce the change events so that the diff is trggered when things go quiet for a second.
            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                const doc = this.getFileDocument(path);
                try {
                    const file = this.files.getWeakRef(path);
                    const unit = file.unit;
                    const changeHandler = debounce(uploadFileEditsToRoom(path, unit, room), SYNCH_DELAY_MILLISECONDS);
                    this.roomDocumentChangeListenerRemovers[path] = doc.addChangeListener(changeHandler);
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
        const paths = this.files.keys;
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const doc = this.getFileDocument(path);
            try {
                this.roomDocumentChangeListenerRemovers[path]();
                delete this.roomDocumentChangeListenerRemovers[path];
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
                        // FIXME: Can we wait for the thread to stop?
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
