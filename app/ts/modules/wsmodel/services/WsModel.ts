import { IDeferred, IPromise, IQService } from 'angular';
import { ACE_WORKER_PATH } from '../../../constants';
import { TYPESCRIPT_SERVICES_PATH } from '../../../constants';
import { Annotation, AnnotationType } from '../../../editor/Annotation';
import AutoCompleteCommand from '../../../editor/autocomplete/AutoCompleteCommand';
import CompletionEntry from '../../../editor/workspace/CompletionEntry';
import copyWorkspaceToDoodle from '../../../mappings/copyWorkspaceToDoodle';
// import dependenciesMap from '../../../services/doodles/dependenciesMap';
// import dependencyNames from '../../../services/doodles/dependencyNames';
import Delta from '../../../editor/Delta';
import Diagnostic from '../../../editor/workspace/Diagnostic';
import Disposable from '../../../base/Disposable';
import Document from '../../../editor/Document';
import Editor from '../../../editor/Editor';
import EditSession from '../../../editor/EditSession';
import EventBus from './EventBus';
import FormatCodeSettings from '../../../editor/workspace/FormatCodeSettings';
import { get } from '../../../editor/lib/net';
import getPosition from '../../../editor/workspace/getPosition';
import LanguageServiceProxy from '../../../editor/workspace/LanguageServiceProxy';
import IDoodleConfig from '../../../services/doodles/IDoodleConfig';
import { DOODLE_MANAGER_SERVICE_UUID, IDoodleManager } from '../../../services/doodles/IDoodleManager';
import IWorkspaceModel from '../IWorkspaceModel';
import javascriptSnippets from '../../../editor/snippets/javascriptSnippets';
import KeywordCompleter from '../../../editor/autocomplete/KeywordCompleter';
import Position from '../../../editor/Position';
import Marker from '../../../editor/Marker';
import modeFromName from '../../../utils/modeFromName';
import { LANGUAGE_HTML } from '../../../languages/modes';
import { LANGUAGE_MARKDOWN } from '../../../languages/modes';
import MwEditor from '../../../synchronization/MwEditor';
import MwEdits from '../../../synchronization/MwEdits';
import MwUnit from '../../../synchronization/MwUnit';
import MwWorkspace from '../../../synchronization/MwWorkspace';
import { OutputFilesMessage, outputFilesTopic } from '../IWorkspaceModel';
import OutputFile from '../../../editor/workspace/OutputFile';
import QuickInfo from '../../../editor/workspace/QuickInfo';
import QuickInfoTooltip from '../../../editor/workspace/QuickInfoTooltip';
import QuickInfoTooltipHost from '../../../editor/workspace/QuickInfoTooltipHost';
import Range from '../../../editor/Range';
import { RenamedFileMessage, renamedFileTopic } from '../IWorkspaceModel';
import { ChangedOperatorOverloadingMessage, changedOperatorOverloadingTopic } from '../IWorkspaceModel';
import RoomAgent from '../../rooms/RoomAgent';
import Shareable from '../../../base/Shareable';
import SnippetCompleter from '../../../editor/SnippetCompleter';
import StringShareableMap from '../../../collections/StringShareableMap';
import TextChange from '../../../editor/workspace/TextChange';
// import TextCompleter from '../../editor/autocomplete/TextCompleter';
import { TsLintSettings, RuleArgumentType } from '../../tslint/TsLintSettings';
import typescriptSnippets from '../../../editor/snippets/typescriptSnippets';
import WsFile from './WsFile';
import setOptionalBooleanProperty from '../../../services/doodles/setOptionalBooleanProperty';
import setOptionalStringProperty from '../../../services/doodles/setOptionalStringProperty';
import setOptionalStringArrayProperty from '../../../services/doodles/setOptionalStringArrayProperty';
import UnitListener from './UnitListener';
import WorkspaceCompleter from '../../../editor/workspace/WorkspaceCompleter';
import WorkspaceCompleterHost from '../../../editor/workspace/WorkspaceCompleterHost';

const NEWLINE = '\n';

/**
 * Symbolic constant for the package.json file.
 */
const FILENAME_META = 'package.json';

/**
 * Symbolic constant for the tslint.json file.
 */
const FILENAME_TSLINT_JSON = 'tslint.json';

// The order of importing is important.
// Loading of scripts is synchronous.
const systemImports: string[] = ['/jspm_packages/system.js', '/jspm.config.js'];
/**
 * The script imports for initializing the LanguageServiceProxy.
 * The ordering is important because of dependencies.
 */
const scriptImports: string[] = systemImports.concat(TYPESCRIPT_SERVICES_PATH).concat([ACE_WORKER_PATH]);

/**
 * The worker implementation for the LanguageServiceProxy.
 */
const workerUrl = '/js/worker.js';

/**
 * Classify diagnostics so that they can be reported with differing severity.
 */
type DiagnosticOrigin = 'syntax' | 'semantic' | 'lint';

/**
 * Syntax and Semantic diagnostics are reported to the user as errors.
 * Lint diagnostics are reported as warning.
 */
function diagnosticOriginToAnnotationType(origin: DiagnosticOrigin): AnnotationType {
    switch (origin) {
        case 'syntax':
        case 'semantic': {
            return 'error';
        }
        case 'lint': {
            return 'warning';
        }
        default: {
            throw new Error(`origin: DiagnosticOrigin => ${origin}`);
        }
    }
}

function diagnosticOriginToMarkerClass(origin: DiagnosticOrigin): string {
    switch (origin) {
        case 'syntax':
        case 'semantic': {
            return 'ace_error-marker';
        }
        case 'lint': {
            return 'ace_highlight-marker';
        }
        default: {
            throw new Error(`origin: DiagnosticOrigin => ${origin}`);
        }
    }
}

/**
 * Converts a Diagnostic to an Annotation.
 * The type of the annotation is currently based upon the origin.
 */
function diagnosticToAnnotation(doc: Document, diagnostic: Diagnostic, origin: DiagnosticOrigin): Annotation {
    const minChar = diagnostic.start;
    const pos: Position = getPosition(doc, minChar);
    const type = diagnosticOriginToAnnotationType(origin);
    return { row: pos.row, column: pos.column, text: diagnostic.message, type };
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

/**
 * Asserts that the session really is an EditSession.
 */
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
 * Converts the value to a string and append a newline character.
 */
function stringifyFileContent(value: any): string {
    return `${JSON.stringify(value, null, 4)}${NEWLINE}`;
}

function isHtmlScript(path: string): boolean {
    const period = path.lastIndexOf('.');
    if (period >= 0) {
        const extension = path.substring(period + 1);
        switch (extension) {
            case 'html': {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    console.warn(`isHtmlScript('${path}') can't figure that one out.`);
    return false;
}

/**
 * Determines whether the file is appropriate for the language service.
 * All editors (files) are loaded in the workspace but only TypeScript
 * files are offered to the language service.
 */
function isJavaScript(path: string): boolean {
    const period = path.lastIndexOf('.');
    if (period >= 0) {
        const extension = path.substring(period + 1);
        switch (extension) {
            case 'js': {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    console.warn(`isJavaScript('${path}') can't figure that one out.`);
    return false;
}

function isTypeScript(path: string): boolean {
    const period = path.lastIndexOf('.');
    if (period >= 0) {
        const extension = path.substring(period + 1);
        switch (extension) {
            case 'ts':
            case 'tsx': {
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
 * Synchronize after 0.75 seconds of inactivity.
 */
const SYNCH_DELAY_MILLISECONDS = 750;

/**
 * Semantic validation waits 0.5 second to avoid flickering.
 */
const SEMANTIC_DELAY_MILLISECONDS = 500;

/**
 * Persist to Local Storage after 2 seconds of inactivity.
 */
const STORE_DELAY_MILLISECONDS = 2000;

/**
 * debounce is used for throttling...
 * 1. Semantic Validation.
 * 2. Persistence of changes to local storage.
 * 3. Distributed synchronization.
 */
function debounce(next: () => any, delay: number) {

    /**
     * The timer handle.
     */
    let timer: number | undefined;

    return function () {
        if (timer) {
            window.clearTimeout(timer);
        }
        timer = window.setTimeout(function () {
            timer = void 0;
            next();
        }, delay);
    };
}

function uploadFileEditsToRoom(path: string, unit: MwUnit, room: RoomAgent) {
    return function () {
        const edits = unit.getEdits(room.id);
        room.setEdits(path, edits);
    };
}

/**
 * The workspace data model.
 * This class is exposed as a service which implies there will be one long-running instance of it
 * for the lifetime of the application. At the same time, the user may serally edit multiple models 
 * and so this instance must have state so that it can manage the associated worker threads.
 */
export default class WsModel implements IWorkspaceModel, Disposable, MwWorkspace, QuickInfoTooltipHost, Shareable, WorkspaceCompleterHost {

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
     * A mapping from the file path to the last JavaScript code emitted by the TypeScript compiler.
     */
    lastKnownJs: { [path: string]: string } = {};
    /**
     * Source maps will be used to relate runtime exceptions to the source location.
     */
    lastKnownJsMap: { [path: string]: string } = {};

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
    private files: StringShareableMap<WsFile> | undefined;

    /**
     * Files that have been deleted (used to support updating a Gist).
     */
    private trash: StringShareableMap<WsFile> | undefined;

    /**
     * Keep track of in-flight requests so that we can prevent cascading requests in an indeterminate state.
     * Increment before an asynchronous call is made.
     * Decrement when the response is received.
     */
    private inFlight = 0;

    private quickInfo: { [path: string]: QuickInfoTooltip } = {};
    private annotationHandlers: { [path: string]: (event: { data: Annotation[], type: 'annotation' }) => any } = {};

    private refMarkers: number[] = [];

    /**
     * The diagnostics allow us to place markers in the marker layer.
     * This array keeps track of the marker identifiers so that we can
     * remove the existing ones when the time comes to replace them.
     */
    private errorMarkerIds: number[] = [];

    private languageServiceProxy: LanguageServiceProxy | undefined;

    /**
     * The room that this workspace is currently connected to.
     */
    private room: RoomAgent | undefined;
    private roomMaster: boolean;

    private roomListener: UnitListener | undefined;

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
     * This promise is defined once the refCount has reached zero.
     * It is resolved when monitoring has ended on all documents.
     */
    private windingDown: IPromise<any> | undefined;

    /**
     * This promise is defined once the reference count goes above zero
     * and is resolved when it becomes zero again.
     * It's a promise that the reference count will fall to zero, eventually.
     * This is used to prevent re-initialization before all references have been dropped.
     */
    private zeroRefCount: IPromise<any> | undefined;
    private zeroRefCountDeferred: IDeferred<any> | undefined;

    /**
     * 
     */
    private eventBus: EventBus<any, WsModel> = new EventBus<any, WsModel>(this);

    public trace_ = false;

    public static $inject: string[] = ['$q', DOODLE_MANAGER_SERVICE_UUID];

    /**
     * AngularJS service; parameters must match static $inject property.
     */
    constructor(private $q: IQService, private doodles: IDoodleManager) {
        // This will be called once, lazily, when this class is deployed as a singleton service.
        // We do nothing. There is no destructor; it would never be called.
    }

    /**
     * Informs the workspace that we want to reuse it.
     * This method starts the workspace thread.
     * This is the counterpart of the dispose method.
     */
    recycle(callback: (err: any) => any): void {
        if (this.zeroRefCount) {
            this.zeroRefCount
                .then(() => {
                    this.zeroRefCount = void 0;
                    this.zeroRefCountDeferred = void 0;
                    this.recycle(callback);
                })
                .catch((reason) => {
                    console.warn(`Error while waiting for references to return to zero: ${JSON.stringify(reason)}`);
                });
        }
        else if (this.windingDown) {
            this.windingDown
                .then(() => {
                    this.windingDown = void 0;
                    this.recycle(callback);
                })
                .catch((reason) => {
                    console.warn(`Error while waiting for workspace to wind down: ${JSON.stringify(reason)}`);
                });
        }
        else {
            if (this.refCount > 0) {
                console.warn("recycle happening while refCount non-zero.");
            }
            this.addRef();
            if (this.languageServiceProxy) {
                this.inFlight++;
                this.languageServiceProxy.initialize(scriptImports, (err: any) => {
                    this.inFlight--;
                    if (!err) {
                        if (this.languageServiceProxy) {
                            this.languageServiceProxy.setTrace(this.trace_, callback);
                        }
                    }
                    else {
                        callback(err);
                    }
                });
            }
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
            this.zeroRefCountDeferred = this.$q.defer();
            this.zeroRefCount = this.zeroRefCountDeferred.promise;
        }
        this.refCount++;
        return this.refCount;
    }

    release(): number {
        this.refCount--;
        if (this.refCount === 0) {
            const deferred = this.$q.defer();
            this.endMonitoring(() => {
                this.eventBus.reset();
                if (this.languageServiceProxy) {
                    this.languageServiceProxy.terminate();
                    this.languageServiceProxy = void 0;
                }
                if (this.files) {
                    this.files.release();
                    this.files = void 0;
                }
                if (this.trash) {
                    this.trash.release();
                    this.trash = void 0;
                }
                deferred.resolve();
                if (this.windingDown) {
                    this.windingDown = void 0;
                }
            });
            // The winding down promise should be in place before we resolve the zero refCount promise.
            this.windingDown = deferred.promise;
            if (this.zeroRefCountDeferred) {
                this.zeroRefCountDeferred.resolve();
                this.zeroRefCountDeferred = void 0;
                this.zeroRefCount = void 0;
            }
        }
        return this.refCount;
    }

    /**
     * Notifies the callback when the specified event happens.
     * The function returned may be used to remove the watch.
     */
    watch<T>(eventName: string, callback: (event: T, source: WsModel) => void): () => any {
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
        if (this.files) {
            const paths = this.files.keys;
            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                files[path] = this.files.getWeakRef(path);
            }
        }
        return files;
    }

    /**
     * A map of path to WsFile that is not reference counted.
     */
    get trashByPath(): { [path: string]: WsFile } {
        const trash: { [path: string]: WsFile } = {};
        if (this.trash) {
            const paths = this.trash.keys;
            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                trash[path] = this.trash.getWeakRef(path);
            }
        }
        return trash;
    }

    /**
     * Executes an HTTP GET request to the specified URL.
     * Uses the returned contents to set the default library on the language service (proxy).
     * This method is asynchronous. The callback is executed upon completion.
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

    synchModuleKind(moduleKind: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.setModuleKind(moduleKind, function (reason) {
                if (!reason) {
                    resolve(moduleKind);
                }
                else {
                    reject(reason);
                }
            });
        });
    }

    private setModuleKind(moduleKind: string, callback: (err: any) => any): void {
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
     * Synchronizes the local operatorOverloading with the language service.
     */
    synchOperatorOverloading(): Promise<boolean> {
        const operatorOverloading = this.operatorOverloading;
        return new Promise<boolean>((resolve, reject) => {
            this.setOperatorOverloading(operatorOverloading, function (reason) {
                if (!reason) {
                    resolve(operatorOverloading);
                }
                else {
                    reject(reason);
                }
            });
        });
    }

    /**
     * Helper method for updating the operatorOverloading setting in the language service.
     */
    private setOperatorOverloading(operatorOverloading: boolean, callback: (err: any) => any): void {
        checkCallback(callback);
        if (this.languageServiceProxy) {
            this.inFlight++;
            this.languageServiceProxy.setOperatorOverloading(operatorOverloading, (err: any) => {
                this.inFlight--;
                callback(err);
            });
        }
        else {
            callback(new Error("operatorOverloading is not available."));
        }
    }

    synchScriptTarget(scriptTarget: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.setScriptTarget(scriptTarget, function (reason) {
                if (!reason) {
                    resolve(scriptTarget);
                }
                else {
                    reject(reason);
                }
            });
        });
    }

    private setScriptTarget(scriptTarget: string, callback: (err: any) => any): void {
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

    setTrace(trace: boolean, callback: (err: any) => any): void {
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

    deleteEditor(): void {
        throw new Error("TODO: deleteEditor");
    }

    /**
     * Attaching the Editor to the workspace enables the IDE features.
     */
    attachEditor(path: string, editor: Editor): void {

        // The user may elect to open an editor but then leave the workspace as the editor is opening.
        if (this.isZombie()) {
            return;
        }

        this.addRef();

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
            // Enable auto completion using the workspace.
            // The command seems to be required on order to enable method completion.
            // However, it has the side-effect of enabling global completions (Ctrl-Space, etc).
            // FIXME: How do we remove these later?
            editor.commands.addCommand(new AutoCompleteCommand());
            editor.completers.push(new WorkspaceCompleter(path, this));
            // Not using the SnippetCompleter because it makes Ctrl-Space on imports less ergonomic.
            // editor.completers.push(new SnippetCompleter());
            editor.snippetManager.register(typescriptSnippets);

            // Finally, enable QuickInfo.
            const quickInfo = new QuickInfoTooltip(path, editor, this);
            quickInfo.init();
            this.quickInfo[path] = quickInfo;
        }
        else if (isJavaScript(path)) {
            // Enable auto completion using the workspace.
            // The command seems to be required on order to enable method completion.
            // However, it has the side-effect of enabling global completions (Ctrl-Space, etc).
            // FIXME: How do we remove these later?
            editor.commands.addCommand(new AutoCompleteCommand());
            editor.completers.push(new WorkspaceCompleter(path, this));
            // Not using the SnippetCompleter because it makes Ctrl-Space on imports less ergonomic.
            // editor.completers.push(new SnippetCompleter());
            editor.snippetManager.register(javascriptSnippets);

            // Finally, enable QuickInfo.
            const quickInfo = new QuickInfoTooltip(path, editor, this);
            quickInfo.init();
            this.quickInfo[path] = quickInfo;
        }
        else if (isHtmlScript(path)) {
            editor.commands.addCommand(new AutoCompleteCommand());
            editor.completers.push(new KeywordCompleter());
            editor.completers.push(new SnippetCompleter());
        }
        else {
            editor.commands.addCommand(new AutoCompleteCommand());
            editor.completers.push(new KeywordCompleter());
            editor.completers.push(new SnippetCompleter());
        }

        this.attachSession(path, editor.getSession());
    }

    /**
     * Detaching the Editor from the workspace disables the IDE features.
     */
    detachEditor(path: string, editor: Editor): void {

        if (this.isZombie()) {
            return;
        }
        try {
            checkPath(path);
            checkEditor(editor);

            this.setFileEditor(path, void 0);

            if (isTypeScript(path)) {
                // Remove QuickInfo
                if (this.quickInfo[path]) {
                    const quickInfo = this.quickInfo[path];
                    quickInfo.terminate();
                    delete this.quickInfo[path];
                }
                // TODO: Remove the completer?
                // TODO: Remove the AutoCompleteCommand:
            }
            else if (isJavaScript(path)) {
                // Remove QuickInfo
                if (this.quickInfo[path]) {
                    const quickInfo = this.quickInfo[path];
                    quickInfo.terminate();
                    delete this.quickInfo[path];
                }
                // TODO: Remove the completer?
                // TODO: Remove the AutoCompleteCommand:
            }

            this.detachSession(path, editor.getSession());
        }
        finally {
            this.release();
        }
    }

    private attachSession(path: string, session: EditSession | undefined): void {
        checkPath(path);

        if (session) {
            checkSession(session);
        }
        else {
            return;
        }

        if (isTypeScript(path) || isJavaScript(path)) {
            if (!this.annotationHandlers[path]) {

                /**
                 * Wrapper to throttle requests for semantic errors.
                 */
                const refreshDiagnosticsCleanup = debounce(() => {
                    this.refreshDiagnostics(function (err) {
                        if (err) {
                            console.warn(`Error returned from request for semantic diagnostics for path => ${path}: ${err}`);
                        }
                    });
                }, SEMANTIC_DELAY_MILLISECONDS);

                // When the LanguageMode has completed syntax analysis, it emits annotations.
                // This is our cue to begin semantic analysis and make use of transpiled files.
                /**
                 * Handler for annotations received from the language worker thread.
                 */
                const annotationsHandler = (event: { data: Annotation[], type: 'annotation' }) => {
                    // Only make the request for semantic errors if there are no syntactic errors.
                    // This doesn't make a lot of sense because we only consider one file.
                    const annotations = event.data;
                    if (annotations.length === 0) {
                        // A change in a single file triggers analysis of all files.
                        refreshDiagnosticsCleanup();
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

    private detachSession(path: string, session: EditSession | undefined) {
        checkPath(path);

        if (session) {
            checkSession(session);
        }
        else {
            return;
        }

        if (isTypeScript(path) || isJavaScript(path)) {
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
     * Begins monitoring the Document at the specified path for changes and adds the script to the LanguageService.
     */
    beginDocumentMonitoring(path: string, callback: (err: any) => any): void {
        checkPath(path);
        checkCallback(callback);

        const doc = this.getFileDocument(path);
        if (doc) {
            try {
                checkDocument(doc);

                // Monitoring for Language Analysis.
                if (isTypeScript(path) || isJavaScript(path)) {
                    if (!this.langDocumentChangeListenerRemovers[path]) {
                        const changeHandler = (delta: Delta) => {
                            if (this.languageServiceProxy) {
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
                            }
                        };
                        this.langDocumentChangeListenerRemovers[path] = doc.addChangeListener(changeHandler);
                    }

                    // Ensure the script in the language service.
                    const hook = function (err: any) {
                        if (err) {
                            console.warn(`WsModel.beginDocumentMonitoring(${path}) failed ${err}`);
                        }
                        callback(err);
                    };
                    this.ensureScript(path, doc.getValue(), hook);
                }
                else {
                    window.setTimeout(function () {
                        callback(void 0);
                    }, 0);
                }

                // Monitoring for Local Storage.
                const storageHandler = debounce(() => { this.updateStorage(); }, STORE_DELAY_MILLISECONDS);
                this.saveDocumentChangeListenerRemovers[path] = doc.addChangeListener(storageHandler);
            }
            finally {
                doc.release();
            }
        }
    }

    /**
     * Ends monitoring the Document at the specified path for changes and removes the script from the LanguageService.
     */
    endDocumentMonitoring(path: string, callback: (err: any) => any) {
        try {
            checkPath(path);
            checkCallback(callback);

            const doc = this.getFileDocument(path);
            if (doc) {
                try {
                    checkDocument(doc);

                    // Monitoring for Language Analysis.
                    if (isTypeScript(path) || isJavaScript(path)) {
                        if (this.langDocumentChangeListenerRemovers[path]) {
                            this.langDocumentChangeListenerRemovers[path]();
                            delete this.langDocumentChangeListenerRemovers[path];

                            // Remove the script from the language service.
                            const hook = function (err: any) {
                                if (err) {
                                    console.warn(`WsModel.endDocumentMonitoring(${path}) failed ${err}`);
                                }
                                callback(err);
                            };
                            this.removeScript(path, hook);
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
        }
        catch (e) {
            console.warn(`Exeption while processing endDocumentMonitoring(${path}) ${e}`);
        }
    }

    private endMonitoring(callback: () => any) {
        const paths = Object.keys(this.langDocumentChangeListenerRemovers);
        const iLen = paths.length;
        let outstanding = iLen;
        if (outstanding > 0) {
            for (let i = 0; i < iLen; i++) {
                const path = paths[i];
                this.endDocumentMonitoring(path, function (err) {
                    if (!err) {
                        outstanding--;
                        if (outstanding === 0) {
                            callback();
                        }
                    }
                    else {
                        console.warn(`endDocumentMonitoring(${path}) => ${err}`);
                    }
                });
            }
        }
        else {
            setTimeout(callback, 0);
        }
    }

    ensureModuleMapping(moduleName: string, fileName: string): Promise<boolean> {
        return this.languageServiceProxy.ensureModuleMapping(moduleName, fileName);
    }

    removeModuleMapping(moduleName: string): Promise<boolean> {
        return this.languageServiceProxy.removeModuleMapping(moduleName);
    }

    /**
     * 
     */
    ensureScript(path: string, content: string, callback: (err: any) => any): void {
        checkPath(path);
        checkCallback(callback);
        if (this.languageServiceProxy) {
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
    }

    /**
     * 
     */
    removeScript(path: string, callback: (err: any) => any) {
        checkPath(path);
        checkCallback(callback);
        if (this.languageServiceProxy) {
            this.inFlight++;
            this.languageServiceProxy.removeScript(path, (err: any) => {
                this.inFlight--;
                if (err) {
                    window.console.warn(`WsModel.removeScript(${path}) failed ${err}`);
                }
                callback(err);
            });
        }
    }

    /**
     * Requests the diagnostics for all edit sessions.
     * The results are used to update the corresponding edit session objects.
     */
    public refreshDiagnostics(callback: (err: any) => any): void {
        const tsPaths = this.getFileSessionPaths().filter(isTypeScript);
        const tsLength = tsPaths.length;
        let tsRemaining = tsLength;
        for (let i = 0; i < tsLength; i++) {
            const tsPath = tsPaths[i];
            const session = this.getFileSession(tsPath);
            if (session) {
                try {
                    this.diagnosticsForSession(tsPath, session, function () {
                        tsRemaining--;
                        if (tsRemaining === 0) {
                            callback(void 0);
                        }
                    });
                }
                finally {
                    session.release();
                }
            }
        }
    }

    /**
     * Transfers the diagnostic information to the appropriate edit session.
     */
    private updateSession(path: string, diagnostics: Diagnostic[], session: EditSession, origin: DiagnosticOrigin): void {
        // We have the path and diagnostics, so we should be able to provide hyperlinks to errors.
        if (session) {
            checkSession(session);
        }
        else {
            return;
        }

        const file = this.getFileWeakRef(path);
        if (file) {
            file.tainted = false;
        }

        const doc = session.docOrThrow();

        const annotations = diagnostics.map(function (diagnostic) {
            if (file) {
                file.tainted = true;
            }
            return diagnosticToAnnotation(doc, diagnostic, origin);
        });
        session.setAnnotations(annotations);

        this.errorMarkerIds.forEach(function (markerId) { session.removeMarker(markerId); });


        // Add highlighting markers to the text.
        const markerClass = diagnosticOriginToMarkerClass(origin);
        diagnostics.forEach((diagnostic) => {
            const minChar = diagnostic.start;
            const limChar = minChar + diagnostic.length;
            const start = getPosition(doc, minChar);
            const end = getPosition(doc, limChar);
            const range = new Range(start.row, start.column, end.row, end.column);
            // Add a new marker to the given Range. The last argument (inFront) causes a
            // front marker to be defined and the 'changeFrontMarker' event fires.
            // The class parameter is a css stylesheet class so you must have it in your CSS.
            this.errorMarkerIds.push(session.addMarker(range, markerClass, "text", null, true));
        });
    }

    /**
     * Requests the disgnostics for the specified file.
     * The results are used to update the appropriate edit session.
     */
    private diagnosticsForSession(path: string, session: EditSession, callback: (err: any) => any): void {
        checkPath(path);
        if (this.languageServiceProxy) {
            this.inFlight++;
            this.languageServiceProxy.getSyntaxErrors(path, (err: any, syntaxErrors: Diagnostic[]) => {
                this.inFlight--;
                if (err) {
                    console.warn(`getSyntaxErrors(${path}) => ${err}`);
                    callback(err);
                }
                else {
                    this.updateSession(path, syntaxErrors, session, 'syntax');
                    if (syntaxErrors.length === 0) {
                        if (this.languageServiceProxy) {
                            this.inFlight++;
                            this.languageServiceProxy.getSemanticErrors(path, (err: any, semanticErrors: Diagnostic[]) => {
                                this.inFlight--;
                                if (err) {
                                    console.warn(`getSemanticErrors(${path}) => ${err}`);
                                    callback(err);
                                }
                                else {
                                    this.updateSession(path, semanticErrors, session, 'semantic');
                                    if (semanticErrors.length === 0) {
                                        if (this.languageServiceProxy) {
                                            const configuration = this.tslintConfiguration;
                                            if (configuration) {
                                                this.inFlight++;
                                                this.languageServiceProxy.getLintErrors(path, configuration, (err: any, lintErrors: Diagnostic[]) => {
                                                    this.inFlight--;
                                                    if (err) {
                                                        console.warn(`getLintErrors(${path}) => ${err}`);
                                                        callback(err);
                                                    }
                                                    else {
                                                        this.updateSession(path, lintErrors, session, 'lint');
                                                        callback(void 0);
                                                    }
                                                });
                                            }
                                        }
                                    }
                                    else {
                                        callback(void 0);
                                    }
                                }
                            });
                        }
                    }
                    else {
                        callback(void 0);
                    }
                }
            });
        }
    }

    /**
     * Requests the output files (JavaScript and source maps) for all files that are transpiled.
     * The responses are published on the outputFilesTopic.
     */
    public outputFiles(): void {
        const paths = this.getFileDocumentPaths();
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            if (isTypeScript(path) || isJavaScript(path)) {
                this.outputFilesForPath(path);
            }
        }
    }

    /**
     * Requests the output files (JavaScript and source maps) for the specified file.
     * The response is published on the outputFilesTopic.
     */
    private outputFilesForPath(path: string): void {
        if (isTypeScript(path) || isJavaScript(path)) {
            checkPath(path);
            if (this.languageServiceProxy) {
                this.inFlight++;
                this.languageServiceProxy.getOutputFiles(path, (err: any, outputFiles: OutputFile[]) => {
                    this.inFlight--;
                    if (!err) {
                        this.eventBus.emit(outputFilesTopic, new OutputFilesMessage(outputFiles));
                    }
                    else {
                        console.warn(`getOutputFilesForPath(${path}) => ${err}`);
                    }
                });
            }
        }
        else {
            console.warn(`getOutputFilesForPath(${path}) ignored.`);
        }
    }

    get author(): string | undefined {
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

    set author(author: string | undefined) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: IDoodleConfig = JSON.parse(file.getText());
            setOptionalStringProperty('author', author, metaInfo);
            file.setText(stringifyFileContent(metaInfo));
        }
        finally {
            file.release();
        }
    }

    /**
     * dependencies a list of package names, the unique identifier for libraries.
     */
    get dependencies(): { [packageName: string]: string } {
        try {
            if (this.existsPackageJson()) {
                const pkgInfo = this.packageInfo;
                if (pkgInfo) {
                    return pkgInfo.dependencies;
                }
                else {
                    return {};
                }
            }
            else {
                return {};
            }
        }
        catch (e) {
            console.warn(e);
            return {};
        }
    }

    set dependencies(dependencies: { [packageName: string]: string }) {
        try {
            const file = this.ensurePackageJson();
            try {
                const metaInfo: IDoodleConfig = JSON.parse(file.getText());
                metaInfo.dependencies = dependencies;
                file.setText(stringifyFileContent(metaInfo));
            }
            finally {
                file.release();
            }
        }
        catch (e) {
            console.warn(`Unable to set dependencies property in file '${FILENAME_META}'.`);
        }
    }

    get description(): string | undefined {
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

    set description(description: string | undefined) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: IDoodleConfig = JSON.parse(file.getText());
            setOptionalStringProperty('description', description, metaInfo);
            file.setText(stringifyFileContent(metaInfo));
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
                    return pkgInfo.keywords;
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
            file.setText(stringifyFileContent(metaInfo));
        }
        finally {
            file.release();
        }
    }

    get name(): string | undefined {
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

    set name(name: string | undefined) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: IDoodleConfig = JSON.parse(file.getText());
            metaInfo.name = name;
            file.setText(stringifyFileContent(metaInfo));
        }
        catch (e) {
            console.warn(`Unable to set name property in file '${FILENAME_META}'.`);
        }
        finally {
            file.release();
        }
    }

    get noLoopCheck(): boolean {
        if (this.existsPackageJson()) {
            const pkgInfo = this.packageInfo;
            if (pkgInfo) {
                return pkgInfo.noLoopCheck ? true : false;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    set noLoopCheck(noLoopCheck: boolean) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: IDoodleConfig = JSON.parse(file.getText());
            setOptionalBooleanProperty('noLoopCheck', noLoopCheck, metaInfo);
            file.setText(stringifyFileContent(metaInfo));
        }
        catch (e) {
            console.warn(`Unable to set noLoopCheck property in file '${FILENAME_META}'.`);
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
        const oldValue = this.operatorOverloading;
        if (operatorOverloading !== oldValue) {
            const file = this.ensurePackageJson();
            try {
                const metaInfo: IDoodleConfig = JSON.parse(file.getText());
                setOptionalBooleanProperty('operatorOverloading', operatorOverloading, metaInfo);
                file.setText(stringifyFileContent(metaInfo));
                if (this.languageServiceProxy) {
                    this.inFlight++;
                    this.languageServiceProxy.setOperatorOverloading(operatorOverloading, (reason) => {
                        this.inFlight--;
                        if (reason) {
                            console.warn(`Unable to set operator overloading on language service. Cause: ${reason}`);
                        }
                        else {
                            this.eventBus.emit(changedOperatorOverloadingTopic, new ChangedOperatorOverloadingMessage(oldValue, operatorOverloading));
                        }
                    });
                }
            }
            catch (e) {
                console.warn(`Unable to set operatorOverloading property in file '${FILENAME_META}'. Cause: ${e}`);
            }
            finally {
                file.release();
            }
        }
    }

    get version(): string | undefined {
        if (this.existsPackageJson()) {
            const pkgInfo = this.packageInfo;
            if (pkgInfo) {
                return pkgInfo.version;
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }

    set version(version: string | undefined) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: IDoodleConfig = JSON.parse(file.getText());
            metaInfo.version = version;
            file.setText(stringifyFileContent(metaInfo));
        }
        finally {
            file.release();
        }
    }

    protected destructor(): void {
        // This may never be called when this class is deployed as a singleton service.
    }

    /**
     * Creates a new file. The file is not monitored.
     */
    newFile(path: string): WsFile {
        const mode = modeFromName(path);
        if (!this.existsFile(path)) {
            const trashedFile = this.trash ? this.trash.get(path) : void 0;
            if (!trashedFile) {
                const file = new WsFile(this);
                file.setText("");
                file.mode = mode;
                if (!this.files) {
                    this.files = new StringShareableMap<WsFile>();
                }
                // The file is captured by the files collection (incrementing the reference count).
                this.files.put(path, file);
                // We return the other reference.
                return file;
            }
            else {
                this.restoreFileFromTrash(path);
                trashedFile.mode = mode;
                return trashedFile;
            }
        }
        else {
            throw new Error(`${path} already exists. The path must be unique.`);
        }
    }

    /**
     * 1. Ends monitoring of the Document at the specified path.
     * 2. Removes the file from the workspace, placing it in trash if need be for GitHub.
     * 3. Removes the corresponding last known JavaScript.
     * 4. Updates Local Storage.
     */
    deleteFile(path: string, callback: (reason: Error | null) => any): void {
        const file = this.files ? this.files.getWeakRef(path) : void 0;
        if (file) {
            // Determine whether the file exists in GitHub so that we can DELETE it upon upload.
            // Use the raw_url as the sentinel. Keep it in trash for later deletion.
            this.endDocumentMonitoring(path, () => {
                if (file.existsInGitHub) {
                    // It's a file that DOES exist on GitHub. Move it to trash so that it gets synchronized properly.
                    this.moveFileToTrash(path);
                }
                else {
                    // It's a file that does NOT exist on GitHub. Remove it completely.
                    if (this.files) {
                        this.files.remove(path).release();
                    }
                }
                delete this.lastKnownJs[path];
                delete this.lastKnownJsMap[path];
                this.updateStorage();
                callback(null);
            });
        }
        else {
            setTimeout(() => {
                callback(new Error(`deleteFile(${path}), ${path} was not found.`));
            }, 0);
        }
    }

    existsFile(path: string): boolean {
        return this.files ? this.files.exists(path) : false;
    }

    /**
     * Sets the `isOpen` property of the file specified by the `path` argument to `true`.
     * Many files can be open at any one time.
     */
    openFile(path: string): void {
        const file = this.files ? this.files.getWeakRef(path) : void 0;
        if (file) {
            // The UI should see this change, ng-if enabling the 'editor' directive which
            // creates an Editor, which requests an EditSession, notifies the controller
            // of its creation, eventually getting back to the workspace and the file.
            file.isOpen = true;
            this.updateStorage();
        }
    }

    /**
     * Renames a file.
     * The file should not be being monitored.
     */
    renameFileUnmonitored(oldPath: string, newPath: string): void {
        const mode = modeFromName(newPath);
        if (!mode) {
            throw new Error(`${newPath} is not a recognized language.`);
        }
        // Make sure that the file we want to re-path really does exist.
        const oldFile = this.files ? this.files.getWeakRef(oldPath) : void 0;
        if (oldFile) {
            if (!this.existsFile(newPath)) {
                // Determine whether we can recycle a file from trash or must create a new file.
                if (!this.existsFileInTrash(newPath)) {

                    // We must create a new file.
                    const newFile = this.newFile(newPath);

                    // Initialize properties.
                    newFile.setText(oldFile.getText());
                    newFile.isOpen = oldFile.isOpen;
                    newFile.selected = oldFile.selected;

                    // Make it clear that this file did not come from GitHub.
                    newFile.existsInGitHub = false;

                    // Initialize properties that depend upon the new path.
                    newFile.mode = mode;

                    if (this.files) {
                        this.files.putWeakRef(newPath, newFile);
                    }
                }
                else {
                    // We can recycle a file from trash.
                    this.restoreFileFromTrash(newPath);
                    if (this.files) {
                        const theFile = this.files.getWeakRef(newPath);
                        // Initialize properties that depend upon the new path.
                        theFile.mode = mode;
                    }
                }
                // Delete the file by the old path, remove monitoring etc.
                this.deleteFile(oldPath, (reason: Error) => {
                    if (reason) {
                        console.warn(`renameFile('${oldPath}', '${newPath}') could not delete the oldFile: ${reason.message}`);
                    }
                });
                this.beginDocumentMonitoring(newPath, (err) => {
                    if (!err) {
                        this.eventBus.emit(renamedFileTopic, new RenamedFileMessage(oldPath, newPath));
                        this.outputFilesForPath(newPath);
                    }
                });
            }
            else {
                throw new Error(`${newPath} already exists. The new path must be unique.`);
            }
        }
        else {
            throw new Error(`${oldPath} does not exist. The old path must be the path of an existing file.`);
        }
    }

    /**
     * Sets the `selected` property of the file specified by the `path` parameter to `true`.
     * Only one file can be selected at any one time.
     */
    selectFile(path: string): void {
        if (this.files) {
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
    }

    closeFile(path: string): void {
        if (this.files) {
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
    }

    markAllFilesAsInGitHub(): void {
        if (this.files) {
            const paths = this.files.keys;
            const iLen = paths.length;
            for (let i = 0; i < iLen; i++) {
                const path = paths[i];
                const file = this.files.getWeakRef(path);
                file.existsInGitHub = true;
            }
        }
    }

    emptyTrash(): void {
        if (this.trash) {
            const paths = this.trash.keys;
            const iLen = paths.length;
            for (let i = 0; i < iLen; i++) {
                const path = paths[i];
                const file = this.trash.remove(path);
                file.release();
            }
        }
    }

    existsFileInTrash(path: string): boolean {
        return this.trash ? this.trash.exists(path) : false;
    }

    /**
     *
     */
    getHtmlFileChoice(): string | undefined {
        if (this.files) {
            const paths = this.files.keys;
            const iLen = paths.length;
            for (let i = 0; i < iLen; i++) {
                const path = paths[i];
                if (this.files.getWeakRef(path).htmlChoice) {
                    return path;
                }
            }
        }
        return void 0;
    }

    getHtmlFileChoiceOrBestAvailable(): string | undefined {
        const chosenFile = this.getHtmlFileChoice();
        if (chosenFile) {
            return chosenFile;
        }
        else {
            let bestFile: string | undefined;
            if (this.files) {
                const paths = this.files.keys;
                const iLen = paths.length;
                for (let i = 0; i < iLen; i++) {
                    const path = paths[i];
                    const mode = modeFromName(path);
                    if (mode === LANGUAGE_HTML) {
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
            }
            return bestFile;
        }
    }

    /**
     *
     */
    getMarkdownFileChoice(): string | undefined {
        if (this.files) {
            const paths = this.files.keys;
            const iLen = paths.length;
            for (let i = 0; i < iLen; i++) {
                const path = paths[i];
                if (this.files.getWeakRef(path).markdownChoice) {
                    return path;
                }
            }
        }
        return void 0;
    }

    getMarkdownFileChoiceOrBestAvailable(): string | undefined {
        const chosenFile = this.getMarkdownFileChoice();
        if (chosenFile) {
            return chosenFile;
        }
        else {
            let bestFile: string | undefined;
            if (this.files) {
                const paths = this.files.keys;
                const iLen = paths.length;
                for (let i = 0; i < iLen; i++) {
                    const path = paths[i];
                    const mode = modeFromName(path);
                    if (mode === LANGUAGE_MARKDOWN) {
                        if (path.toLowerCase() === 'readme.md') {
                            return path;
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
            }
            return bestFile;
        }
    }

    /**
     * Returns the file at the specified path.
     */
    findFileByPath(path: string): WsFile | undefined {
        if (this.files) {
            return this.files.get(path);
        }
        else {
            return void 0;
        }
    }

    getFileWeakRef(path: string): WsFile | undefined {
        if (this.files) {
            return this.files.getWeakRef(path);
        }
        else {
            return void 0;
        }
    }

    getFileEditor(path: string): Editor | undefined {
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
        const files = this.files;
        if (files) {
            const all = files.keys;
            return all.filter((path) => {
                const file = files.getWeakRef(path);
                return file.hasEditor();
            });
        }
        else {
            return [];
        }
    }

    setFileEditor(path: string, editor: Editor | undefined): void {
        if (this.files) {
            const file = this.files.getWeakRef(path);
            if (file) {
                file.setEditor(editor);
            }
        }
    }

    getFileSession(path: string): EditSession | undefined {
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

    /**
     * A list of paths of all the files that have an edit session.
     */
    getFileSessionPaths(): string[] {
        const files = this.files;
        if (files) {
            const all = files.keys;
            return all.filter((path) => {
                const file = files.getWeakRef(path);
                return file.hasSession();
            });
        }
        else {
            return [];
        }
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
    getFileDocument(path: string): Document | undefined {
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
        const files = this.files;
        if (files) {
            const all = files.keys;
            return all.filter((path) => {
                const file = files.getWeakRef(path);
                return file.hasDocument();
            });
        }
        else {
            return [];
        }
    }

    setFileDocument(path: string, doc: Document) {
        if (this.files) {
            const file = this.files.getWeakRef(path);
            if (file) {
                file.setDocument(doc);
            }
        }
    }

    setHtmlFileChoice(path: string): void {
        const files = this.files;
        if (files) {
            const file = files.getWeakRef(path);
            if (file) {
                const paths = files.keys;
                const iLen = paths.length;
                for (let i = 0; i < iLen; i++) {
                    files.getWeakRef(paths[i]).htmlChoice = false;
                }
                file.htmlChoice = true;
            }
            else {
                // Do nothing
            }
        }
    }

    setMarkdownFileChoice(path: string): void {
        const files = this.files;
        if (files) {
            const file = files.getWeakRef(path);
            if (file) {
                const paths = files.keys;
                const iLen = paths.length;
                for (let i = 0; i < iLen; i++) {
                    files.getWeakRef(paths[i]).markdownChoice = false;
                }
                file.markdownChoice = true;
            }
            else {
                // Do nothing
            }
        }
    }

    /**
     * Updates Local Storage with this workspace as the current doodle.
     */
    updateStorage(): void {
        if (!this.isZombie()) {
            // When in room mode we don't want to clobber the current doodle.
            const room = this.room;
            if (room && !this.roomMaster) {
                // TODO: Do we even want to maintain Local Storage in this scenario?
                const matches = this.doodles.filter((doodle) => { return doodle.roomId === room.id; });
                if (matches.length > 0) {
                    if (matches.length === 1) {
                        const doodle = matches[0];
                        copyWorkspaceToDoodle(this, doodle);
                        this.doodles.updateStorage();
                    }
                    else {
                        throw new Error(`Multiple (${matches.length}) doodles in Local Storage for roomId ${room.id}`);
                    }
                }
                else {
                    console.warn(`Unable to find the doodle with roomId ${room.id} in Local Storage.`);
                }
            }
            else {
                const doodle = this.doodles.current();
                if (doodle) {
                    copyWorkspaceToDoodle(this, doodle);
                }
                this.doodles.updateStorage();
            }
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
    get packageInfo(): IDoodleConfig | undefined {
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

    private ensureTsLintJson(): WsFile {
        const existingFile = this.findFileByPath(FILENAME_TSLINT_JSON);
        if (!existingFile) {
            const configuration: TsLintSettings = {};
            const rules: { [name: string]: boolean | RuleArgumentType[] } = {};
            rules['array-type'] = [true, 'array'];
            rules['curly'] = false;
            rules['comment-format'] = [true, 'check-space'];
            rules['eofline'] = true;
            rules['forin'] = true;
            rules['jsdoc-format'] = true;
            rules['new-parens'] = true;
            rules['no-conditional-assignment'] = false;
            rules['no-consecutive-blank-lines'] = true;
            rules['no-construct'] = true;
            rules['no-for-in-array'] = true;
            rules['no-inferrable-types'] = [true];
            rules['no-magic-numbers'] = false;
            rules['no-shadowed-variable'] = true;
            rules['no-string-throw'] = true;
            rules['no-trailing-whitespace'] = [true, 'ignore-jsdoc'];
            rules['no-var-keyword'] = true;
            rules['one-variable-per-declaration'] = [true, 'ignore-for-loop'];
            rules['prefer-const'] = true;
            rules['prefer-for-of'] = true;
            rules['prefer-function-over-method'] = false;
            rules['prefer-method-signature'] = true;
            rules['radix'] = true;
            rules['semicolon'] = [true, 'never'];
            rules['trailing-comma'] = [true, { multiline: 'never', singleline: 'never' }];
            rules['triple-equals'] = true;
            rules['use-isnan'] = true;
            configuration.rules = rules;
            const content = stringifyFileContent(configuration);
            return this.ensureFile(FILENAME_TSLINT_JSON, content);
        }
        else {
            return existingFile;
        }
    }

    /**
     * 
     */
    get tslintConfiguration(): TsLintSettings | undefined {
        try {
            // Beware: We could have a tslint.json that doesn't parse.
            // We must ensure that the user can recover the situation.
            const file = this.ensureTsLintJson();
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
            // We know that the file is defined so the cast is appropriate.
            return <WsFile>this.findFileByPath(path);
        }
    }

    private moveFileToTrash(path: string): void {
        const files = this.files;
        if (files) {
            const unwantedFile = files.getWeakRef(path);
            if (unwantedFile) {
                // Notice that the conflict could be with a TRASHED file.
                const conflictFile = this.trash ? this.trash.getWeakRef(path) : void 0;
                if (!conflictFile) {
                    // There is no conflict, proceed with the move.
                    this.trashPut(path);
                    files.remove(path);
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
    }

    public trashPut(path: string): void {
        if (this.trash) {
            const placeholder = new WsFile(this);
            placeholder.existsInGitHub = true;
            this.trash.putWeakRef(path, placeholder);
        }
    }

    /**
     * Restores a file from trash. The file is not monitored.
     */
    private restoreFileFromTrash(path: string): void {
        const trash = this.trash;
        const files = this.files;
        if (trash && files) {
            const wantedFile = trash.getWeakRef(path);
            if (wantedFile) {
                const conflictFile = files.getWeakRef(path);
                if (!conflictFile) {
                    trash.remove(path);
                    files.putWeakRef(path, wantedFile);
                }
                else {
                    throw new Error(`${path} cannot be restored from trash because of a naming conflict with an existing file.`);
                }
            }
            else {
                throw new Error(`${path} cannot be restored from trash because it does not exist.`);
            }
        }
    }

    /**
     * 1. Initializes the unit: MwUnit property on each file.
     * 2. Connects each unit to its respective file. (A unit can now read/write a file).
     * 3. Create a listener on the room that can send messages to this workspace.
     * 4. Create listeners on each file that send change events as edits to the room.
     * 5. Maintains a reference to the room until the disconnection happens.
     * 
     * @param room The room to connect to.
     * @param master <code>true</code> if the room was created with this workspace as the master.
     */
    connectToRoom(room: RoomAgent, master: boolean): void {

        if (this.room) {
            this.disconnectFromRoom();
        }

        if (room instanceof RoomAgent) {

            this.room = room;
            this.room.addRef();
            this.roomMaster = master;

            // Enumerate the editors in the workspace and add them to the node.
            // This will enable the node to get/set the editor value, diff and apply patches.
            const files = this.files;
            if (files) {
                const paths = files.keys;
                for (let i = 0; i < paths.length; i++) {
                    const path = paths[i];
                    const file = files.getWeakRef(path);
                    // Create the synchronization node associated with the workspace.
                    // This will enable the node to create and destroy editors.
                    file.unit = new MwUnit(this);
                    file.unit.setEditor(file);
                }

                // Add a listener to the room agent so that edits broadcast from the room are
                // received by the appropriate unit, converted to patches and applied.
                this.roomListener = new UnitListener(this);
                room.addListener(this.roomListener);

                // Add listeners for document changes. These will begin the flow of diffs to the server.
                // We debounce the change events so that the diff is trggered when things go quiet for a second.
                for (let i = 0; i < paths.length; i++) {
                    const path = paths[i];
                    const doc = this.getFileDocument(path);
                    if (doc) {
                        try {
                            const file = files.getWeakRef(path);
                            const unit = file.unit;
                            // When the Document emits delta events they gets debounced.
                            // When things go quiet, the unit diffs the file against the shadow to create edits.
                            // The edits are sent to the room (server). 
                            const changeHandler = debounce(uploadFileEditsToRoom(path, unit, room), SYNCH_DELAY_MILLISECONDS);
                            this.roomDocumentChangeListenerRemovers[path] = doc.addChangeListener(changeHandler);
                        }
                        finally {
                            doc.release();
                        }
                    }
                }
            }
        }
        else {
            throw new TypeError("room must be a RoomAgent.");
        }
    }

    /**
     * Performs the contra-operations to the connectToRoom method.
     */
    disconnectFromRoom(): RoomAgent | undefined {
        if (this.room) {
            // Remove listeners on the editor for changes.
            const files = this.files;
            if (files) {
                const paths = files.keys;
                for (let i = 0; i < paths.length; i++) {
                    const path = paths[i];
                    const doc = this.getFileDocument(path);
                    if (doc) {
                        try {
                            this.roomDocumentChangeListenerRemovers[path]();
                            delete this.roomDocumentChangeListenerRemovers[path];
                        }
                        finally {
                            doc.release();
                        }
                    }
                }
            }
            // Remove the listener on the room agent.
            if (this.roomListener) {
                this.room.removeListener(this.roomListener);
                this.roomListener = void 0;
            }
            // Release the room reference.
            const room = this.room;
            this.room = void 0;
            return room;
        }
        else {
            console.warn("No worries, you are already disconnected.");
            return void 0;
        }
    }

    /**
     * For each file, collect the edits and send them to the room.
     */
    uploadToRoom(room: RoomAgent): void {
        if (room) {
            const files = this.files;
            if (files) {
                const paths = files.keys;
                for (let i = 0; i < paths.length; i++) {
                    const path = paths[i];
                    const file = files.getWeakRef(path);
                    const unit = file.unit;
                    const edits: MwEdits = unit.getEdits(room.id);
                    room.setEdits(path, edits);
                }
            }
        }
        else {
            console.warn("We appear to be missing a room");
        }
    }

    isConnectedToRoom(): boolean {
        return !!this.room;
    }

    isRoomOwner(owner: string): boolean | undefined {
        if (this.room) {
            return this.room.owner === owner;
        }
        else {
            // TODO: We probably should throw here.
            return void 0;
        }
    }

    /**
     * This appears to be the only function that requires full access to the Editor
     * because it need to call the updateFrontMarkers method or the Renderer.
     */
    private updateFileSessionMarkerModels(path: string, delta: Delta): void {
        checkPath(path);
        const session = this.getFileSession(path);
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
                    const markerUpdate = function (markerId: number) {
                        const marker: Marker = markers[markerId];
                        let row = delta.start.row;
                        if (lineCount > 0) {
                            row = +1;
                        }
                        if (marker && marker.range && marker.range.start.row > row) {
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

    updateFileEditorFrontMarkers(path: string): void {
        const editor = this.getFileEditor(path);
        if (editor) {
            editor.renderer.updateFrontMarkers();
        }
    }

    /**
     *
     */
    getCompletionsAtPosition(path: string, position: number, prefix: string): Promise<CompletionEntry[]> {
        checkPath(path);
        // FIXME: Promises make it messy to hook for inFlight.
        if (this.languageServiceProxy) {
            return this.languageServiceProxy.getCompletionsAtPosition(path, position, prefix);
        }
        else {
            throw new Error("Language Service is not available.");
        }
    }

    /**
     *
     */
    getFormattingEditsForDocument(path: string, settings: FormatCodeSettings, callback: (err: any, textChanges: TextChange[]) => any): void {
        checkPath(path);
        if (this.languageServiceProxy) {
            this.inFlight++;
            this.languageServiceProxy.getFormattingEditsForDocument(path, settings, (err: any, textChanges: TextChange[]) => {
                this.inFlight--;
                callback(err, textChanges);
            });
        }
    }

    /**
     *
     */
    getQuickInfoAtPosition(path: string, position: number, callback: (err: any, quickInfo: QuickInfo) => any): void {
        checkPath(path);
        if (this.languageServiceProxy) {
            this.inFlight++;
            this.languageServiceProxy.getQuickInfoAtPosition(path, position, (err: any, quickInfo: QuickInfo) => {
                this.inFlight--;
                callback(err, quickInfo);
            });
        }
    }
}
