import { Injectable } from '@angular/core';
import { ACE_WORKER_PATH } from '../../constants';
import { TYPESCRIPT_SERVICES_PATH } from '../../constants';
import { Annotation, AnnotationType } from '../../editor/Annotation';
import AutoCompleteCommand from '../../editor/autocomplete/AutoCompleteCommand';
import { ChangedOperatorOverloadingMessage, changedOperatorOverloading } from './IWorkspaceModel';
import CompletionEntry from '../../editor/workspace/CompletionEntry';
import copyWorkspaceToDoodle from '../../mappings/copyWorkspaceToDoodle';
import Delta from '../../editor/Delta';
import Diagnostic from '../../editor/workspace/Diagnostic';
import Document from '../../editor/Document';
import { DocumentMonitor } from './monitoring.service';
import Editor from '../../editor/Editor';
import EditSession from '../../editor/EditSession';
import { workerCompleted } from '../../editor/EditSession';
import EventBus from './EventBus';
import { EventHub } from './EventHub';
import FormatCodeSettings from '../../editor/workspace/FormatCodeSettings';
import { get } from '../../editor/lib/net';
import getPosition from '../../editor/workspace/getPosition';
import { LanguageServiceProxy } from '../../editor/workspace/LanguageServiceProxy';
import { DoodleManager } from '../../services/doodles/doodleManager.service';
import IWorkspaceModel from './IWorkspaceModel';
import javascriptSnippets from '../../editor/snippets/javascriptSnippets';
import { JspmConfigJsonMonitor } from './monitors/JspmConfigJsonMonitor';
import KeywordCompleter from '../../editor/autocomplete/KeywordCompleter';
import Position from '../../editor/Position';
import Marker from '../../editor/Marker';
import modeFromName from '../../utils/modeFromName';
import { LANGUAGE_HTML } from '../../languages/modes';
import { LANGUAGE_MARKDOWN } from '../../languages/modes';
import MwChange from '../../synchronization/MwChange';
import MwEdits from '../../synchronization/MwEdits';
import { MwOptions } from '../../synchronization/MwOptions';
import MwUnit from '../../synchronization/MwUnit';
import { MwWorkspace } from '../../synchronization/MwWorkspace';
import { IOption, LibraryKind } from '../../services/options/IOption';
import { IOptionManager } from '../../services/options/IOptionManager';
import { OptionManager } from '../../services/options/optionManager.service';
import { OutputFilesMessage, outputFilesTopic } from './IWorkspaceModel';
import OutputFile from '../../editor/workspace/OutputFile';
import { PackageJsonMonitor } from './monitors/PackageJsonMonitor';
import QuickInfo from '../../editor/workspace/QuickInfo';
import QuickInfoTooltip from '../../editor/workspace/QuickInfoTooltip';
import QuickInfoTooltipHost from '../../editor/workspace/QuickInfoTooltipHost';
import Range from '../../editor/Range';
import { RenamedFileMessage, renamedFileTopic } from './IWorkspaceModel';
import { ChangedLintingMessage, changedLinting } from './IWorkspaceModel';
import RoomAgent from '../rooms/RoomAgent';
import { RoomListener } from '../rooms/RoomListener';
import SnippetCompleter from '../../editor/SnippetCompleter';
import StringShareableMap from '../../collections/StringShareableMap';
import TextChange from '../../editor/workspace/TextChange';
import { TsConfigSettings } from '../tsconfig/TsConfigSettings';
import { TsConfigJsonMonitor } from './monitors/TsConfigJsonMonitor';
import { TsLintSettings, RuleArgumentType } from '../tslint/TsLintSettings';
import { TsLintJsonMonitor } from './monitors/TsLintJsonMonitor';
import typescriptSnippets from '../../editor/snippets/typescriptSnippets';
import { TypesConfigJsonMonitor } from './monitors/TypesConfigJsonMonitor';
import { TypeScriptMonitor } from './monitors/TypeScriptMonitor';
import WsFile from './WsFile';
import setOptionalBooleanProperty from '../../services/doodles/setOptionalBooleanProperty';
import setOptionalStringProperty from '../../services/doodles/setOptionalStringProperty';
import setOptionalStringArrayProperty from '../../services/doodles/setOptionalStringArrayProperty';
import { WorkspaceRoomListener } from './WorkspaceRoomListener';
import WorkspaceCompleter from '../../editor/workspace/WorkspaceCompleter';
import WorkspaceCompleterHost from '../../editor/workspace/WorkspaceCompleterHost';

const NEWLINE = '\n';

const TYPES_DOT_CONFIG_DOT_JSON = 'types.config.json';

/**
 * A mapping from module name to URL.
 */
export interface ModuleResolutions {
    [moduleName: string]: string;
}
/**
 * A mapping from global name to URL.
 */
export interface AmbientResolutions {
    [globalName: string]: string;
}

export interface TypesConfigSettings {
    warnings?: boolean;
    /**
     * Not yet supported.
     */
    paths?: { [prefix: string]: string };
    map?: ModuleResolutions;
}

const JSPM_DOT_CONFIG_DOT_JS = 'jspm.config.js';
const JSPM_DOT_CONFIG_DOT_JSON = 'jspm.config.json';

export interface JspmSettings {
    warnings?: boolean;
    paths?: { [prefix: string]: string };
    map?: ModuleResolutions;
}

const PACKAGE_DOT_JSON = 'package.json';

/**
 * This is the schema for the package.json file.
 */
export interface PackageSettings {
    name: string | undefined;
    version: string | undefined;
    description?: string;
    author?: string;
    dependencies: { [key: string]: string };
    noLoopCheck: boolean;
    /**
     * operatorOverloading is a custom property in the package.json.
     */
    operatorOverloading?: boolean;
    linting: boolean;
    keywords: string[];
}

/**
 * Symbolic constant for the tsconfig.json file.
 */
const TSCONFIG_DOT_JSON = 'tsconfig.json';

/**
 * Symbolic constant for the tslint.json file.
 */
const TSLINT_DOT_JSON = 'tslint.json';

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
 * Classify diagnostics so that they can be reported with differing severity (error, warning, or info).
 */
type DiagnosticOrigin = 'syntax' | 'semantic' | 'lint';

const LANGUAGE_SERVICE_NOT_AVAILABLE = "Language Service is not available";

/**
 * Returns a promise that will always report an error indicating that
 * the Language Service is not available.
 */
function noLanguageServicePromise<T>(): Promise<T> {
    return new Promise<T>(function (resolve, reject) {
        reject(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
    });
}

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

/**
 * Asserts that the specified path is a string type.
 */
function checkPath(path: string): void {
    if (typeof path !== 'string') {
        throw new Error("path must be a string.");
    }
}

/**
 * Asserts that the specified editor is an Editor instance.
 */
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

/**
 * Asserts that the specified doc is a Document instance.
 */
function checkDocument(doc: Document): void {
    if (!(doc instanceof Document)) {
        throw new Error("doc must be a Document.");
    }
}

/**
 * Asserts that the specified callback is a function type.
 */
function checkCallback(callback: (err: any) => any): void {
    if (typeof callback !== 'function') {
        throw new Error("callback must be a function.");
    }
}

export function packageNamesToOptions(packageNames: string[], optionManager: IOptionManager): IOption[] {
    return optionManager.filter(function (option) { return packageNames.indexOf(option.packageName) >= 0; });
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

/**
 * This function is used as the handler for debounced editor keystrokes.
 */
function uploadFileEditsToRoom(path: string, unit: MwUnit, room: RoomAgent) {
    return function () {
        const edits = unit.getEdits(room.id);
        room.setEdits(path, edits);
    };
}

// We don't need to export these symbolic constants because we have Observable(s) of the same name.
const changedCompilerSettingsEventName = 'changedCompilerSettings';
const changedJspmSettingsEventName = 'changedJspmSettings';
const changedLintSettingsEventName = 'changedLintSettings';
const changedPackageSettingsEventName = 'changedPackageSettings';
const changedTypesSettingsEventName = 'changedTypesSettings';

export type WsModelEventName = 'changedLinting'
    | 'changedOperatorOverloading'
    | 'outputFiles'
    | 'renamedFile';

/**
 * The workspace data model.
 * This class is exposed as a service which implies there will be one long-running instance of it
 * for the lifetime of the application. At the same time, the user may serally edit multiple models 
 * and so this instance must have state so that it can manage the associated worker threads.
 */
@Injectable()
export default class WsModel implements IWorkspaceModel, MwWorkspace, QuickInfoTooltipHost, WorkspaceCompleterHost {

    /**
     * The owner's login.
     */
    owner?: string;

    /**
     * 
     */
    gistId?: string;

    /**
     * The repository identifier property.
     */
    repo?: string;

    /**
     * 
     */
    created_at?: string;

    /**
     * 
     */
    updated_at?: string;

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

    private readonly mwOptions: MwOptions = { merge: true, verbose: true };

    private readonly quickInfo: { [path: string]: QuickInfoTooltip } = {};

    /**
     * Used only by TypeScript editors
     */
    private readonly annotationHandlers: { [path: string]: (event: { data: Annotation[], type: 'annotation' }) => any } = {};

    private readonly refMarkers: number[] = [];

    /**
     * The diagnostics allow us to place markers in the marker layer.
     * This array keeps track of the marker identifiers so that we can
     * remove the existing ones when the time comes to replace them.
     */
    private readonly errorMarkerIds: number[] = [];

    /**
     * Proxy to TypeScript Language Service in a worker thread.
     */
    private languageServiceProxy: LanguageServiceProxy | undefined;

    /**
     * The room that this workspace is currently connected to.
     */
    private room: RoomAgent | undefined;

    /**
     * This workspace is the one which created the room.
     */
    private roomMaster: boolean;

    private roomListener: RoomListener | undefined;

    /**
     * Listeners added to the document for the LanguageService.
     */
    public readonly langDocumentChangeListenerRemovers: { [path: string]: () => void } = {};
    /**
     * Listeners added to the document for Synchronization.
     */
    private readonly roomDocumentChangeListenerRemovers: { [path: string]: () => void } = {};
    /**
     * Listeners added to the Document for Local Storage.
     */
    private readonly saveDocumentChangeListenerRemovers: { [path: string]: () => void } = {};

    /**
     * A subscription to the tsconfig.json file `change` events in order to keep the
     * Language Service up-to-date with TypeScript compiler settings.
     */
    public readonly docMonitors: { [path: string]: DocumentMonitor } = {};

    /**
     * Slightly unusual reference counting because of:
     * 1) Operating as a service.
     * 2) Handling lifetimes of Editors.
     * The reference count is initialized to zero.
     * It does not control the service lifetime.
     * It is used to control recycle/dispose of the service.
     */
    private refCount = 0;

    /**
     * This promise is defined once the refCount has reached zero.
     * It is resolved when monitoring has ended on all documents.
     * The initial state is undefined.
     */
    private waitUntilMonitoringEnded: Promise<void> | undefined;

    /**
     * This promise is defined once the reference count goes above zero
     * and is resolved when it becomes zero again.
     * It's a promise that the reference count will fall to zero, eventually.
     * This is used to prevent re-initialization before all references have been dropped.
     * The initial state is undefined.
     */
    private waitUntilZeroRefCount: Promise<void> | undefined;
    private zeroRefCountDeferred: (() => void) | undefined;

    /**
     * 
     */
    private readonly eventBus = new EventBus<WsModelEventName, any, WsModel>(this);

    /**
     * TODO: RxJS probably has something for this. Subject or BehaviorSubject?
     */
    public readonly changedCompilerSettings = new EventHub<'changedCompilerSettings', TsConfigSettings, WsModel>(changedCompilerSettingsEventName, this);
    public readonly changedJspmSettings = new EventHub<'changedJspmSettings', JspmSettings, WsModel>(changedJspmSettingsEventName, this);

    /**
     * A coarse event stream for changes to the tslint.json file because we don't need to differentiate changes to parts. 
     */
    public readonly changedTsLintSettings = new EventHub<'changedLintSettings', TsLintSettings, WsModel>(changedLintSettingsEventName, this);

    /**
     * Events are triggered by the package.json DocumentMonitor.
     * Nobody is currently listening.
     */
    public readonly changedPackageSettings = new EventHub<'changedPackageSettings', PackageSettings, WsModel>(changedPackageSettingsEventName, this);

    /**
     * Events are triggered by the types.config.json DocumentMonitor.
     * The workspace controller responds by updating the Language Service.
     * TODO: Move workspace controller functionality into some sort of pipeline or transformer.
     */
    public readonly changedTypesSettings = new EventHub<'changedTypesSettings', TypesConfigSettings, WsModel>(changedTypesSettingsEventName, this);

    /**
     * Used to control logging of the Language Service.
     */
    public traceLanguageService = false;

    /**
     * Used to control logging of the lifecycle of this service (which can be tricky).
     */
    private traceLifecycle = false;

    /**
     * Used to control logging of file operations.
     */
    private traceFileOperations = false;

    /**
     *
     */
    constructor(private doodles: DoodleManager, private optionManager: OptionManager) {
        // This will be called once, lazily, when this class is deployed as a singleton service.
        // We do nothing. There is no destructor; it would never be called.
    }

    /**
     * Informs the workspace that we want to reuse it.
     * This method starts the workspace thread.
     * This is the counterpart of the dispose method.
     * TODO: Refactor to use a Promise.
     * TODO: Refactor to use an Observable ('waiting','ready')?
     */
    recycle(): Promise<void> {
        if (this.traceLifecycle) {
            console.log(`WsModel.recycle()`);
        }
        return new Promise<void>((resolve, reject) => {
            function callback(reason: Error | null | undefined): void {
                if (!reason) {
                    resolve();
                }
                else {
                    reject(reason);
                }
            }
            this.recycleInternal(callback);
        });
    }

    /**
     * The internal recycle implementation that allows for re-entry. 
     */
    private recycleInternal(callback: (err: Error | null | undefined) => void): void {
        if (this.waitUntilZeroRefCount) {
            if (this.traceLifecycle) {
                console.log(`WsModel @waitUntilZeroRefCount`);
            }
            this.waitUntilZeroRefCount
                .then(() => {
                    this.waitUntilZeroRefCount = void 0;
                    this.recycleInternal(callback);
                })
                .catch((reason) => {
                    console.warn(`Error while waiting for references to return to zero: ${JSON.stringify(reason)}`);
                });
        }
        else if (this.waitUntilMonitoringEnded) {
            if (this.traceLifecycle) {
                console.log(`WsModel @waitUntilMonitoringEnded`);
            }
            this.waitUntilMonitoringEnded
                .then(() => {
                    this.waitUntilMonitoringEnded = void 0;
                    this.recycleInternal(callback);
                })
                .catch((reason) => {
                    console.warn(`Error while waiting for workspace to wind down: ${JSON.stringify(reason)}`);
                });
        }
        else {
            if (this.refCount > 0) {
                // We should never end up here, but handle defensively.
                console.warn("recycle happening while refCount non-zero.");
            }
            // Just as dispose calls release, a successful recycle calls addRef.
            this.addRef();
            if (this.languageServiceProxy) {
                this.languageServiceProxy.initialize(scriptImports, (err: any) => {
                    if (!err) {
                        if (this.languageServiceProxy) {
                            this.languageServiceProxy.setTrace(this.traceLanguageService, callback);
                        }
                        else {
                            console.warn("Language Service lost following initialize");
                            callback(null);
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
     * It is called by the workspace controller when it receives an $onDestroy event.
     * The method has to be fire-and-forget (no Promise) because the workspace controller cannot block.
     * It's not actually a dramatic dispose, but instead a reference-counted release because
     * we have to wait until all the editors have been detached for a complete clean-up.
     * In summary, the controller gets $onInit after its view has been created and it gets $onDestroy
     * before its view is destroyed.
     */
    dispose(): void {
        if (this.traceLifecycle) {
            console.log(`WsModel.dispose()`);
        }
        // Just as recycle calls addRef, a dispose calls release.
        this.release();
    }

    /**
     * Indicates that someone is holding a new reference to this workspace.
     * The fact that this method is private reflects the use of recycle/dispose.
     */
    private addRef(): void {
        if (this.traceLifecycle) {
            console.log(`WsModel.addRef() @refCount = ${this.refCount}`);
        }
        if (this.refCount === 0) {
            if (this.files || this.trash) {
                console.warn("Make sure to call dispose() or release()");
            }
            this.files = new StringShareableMap<WsFile>();
            this.trash = new StringShareableMap<WsFile>();
            this.languageServiceProxy = new LanguageServiceProxy(workerUrl);
            this.eventBus.reset();
            this.waitUntilZeroRefCount = new Promise<void>((resolve, reject) => {
                // This will be called immediately and so the lifetime of the
                // variables waitUntilZeroRefCount and zeroRefCountDeferred is the same.
                // TODO: Does this suggest an abstraction to encapsulate?
                this.zeroRefCountDeferred = resolve;
            });
        }
        this.refCount++;
        if (this.traceLifecycle) {
            console.log(`WsModel @refCount = ${this.refCount}`);
        }
    }

    /**
     * Indicates that someone is dropping a reference to this workspace.
     * The fact that this method is private reflects the use of recycle/dispose.
     */
    private release(): void {
        if (this.traceLifecycle) {
            console.log(`WsModel.release() @refCount = ${this.refCount}`);
        }
        this.refCount--;
        if (this.refCount === 0) {
            // We can't return the Promise and wait so we set a property
            this.waitUntilMonitoringEnded = new Promise<void>((resolve, reject) => {
                this.endMonitoring()
                    .then(() => {
                        if (this.traceLifecycle) {
                            console.log(`WsModel Language Service monitoring has ended.`);
                        }
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
                        // Clear this property, we don't need to wait on it in the recycle method.
                        this.waitUntilMonitoringEnded = void 0;
                        resolve();
                    })
                    .catch(function (reason) {
                        reject(reason);
                    });
            });
            // Having initialized the end of monitoring promise, we can continue execution of recycling.
            const resolve = this.zeroRefCountDeferred;
            if (resolve) {
                // Be careful to cleanup up state variables before resuming execution.
                this.waitUntilZeroRefCount = void 0;
                this.zeroRefCountDeferred = void 0;

                // Calling this function will resume execution.
                resolve();
            }
        }
        if (this.traceLifecycle) {
            console.log(`WsModel @refCount = ${this.refCount}`);
        }
    }

    /**
     * Notifies the callback when the specified event happens.
     * The function returned may be used to remove the watch.
     * This is currently used for observing:
     * 1. Output files being emitted.
     * 2. File rename.
     * 3. Change of Operator Overloading property.
     * 
     * TODO: Replace this with type-safe Observable(s).
     */
    watch<T>(eventName: WsModelEventName, callback: (event: T, source: WsModel) => void): () => void {
        return this.eventBus.watch(eventName, callback);
    }

    /**
     * Determines whether this instance is still incapable of accepting method calls.
     */
    isZombie(): boolean {
        return this.refCount === 0;
    }

    /**
     * Returns a map of paths to file.
     * The map is a copy but the files are by reference.
     * The files in the map have not been reference counted.
     */
    get filesByPath(): { [path: string]: WsFile } {
        const files: { [path: string]: WsFile } = {};
        if (this.files) {
            const paths = this.files.keys;
            for (const path of paths) {
                files[path] = this.files.getWeakRef(path);
            }
        }
        return files;
    }

    /**
     * Returns a map of path to WsFile for files in trash.
     * The map is a copy but the files are by reference.
     * The files in the map have not been reference counted.
     */
    get trashByPath(): { [path: string]: WsFile } {
        const trash: { [path: string]: WsFile } = {};
        if (this.trash) {
            const paths = this.trash.keys;
            for (const path of paths) {
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
    setDefaultLibrary(url: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            get(url, (err: Error, sourceCode: string) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (this.languageServiceProxy) {
                        this.languageServiceProxy.setDefaultLibContent(sourceCode, (err: any) => {
                            if (!err) {
                                resolve();
                            }
                            else {
                                reject(err);
                            }
                        });
                    }
                    else {
                        reject(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
                    }
                }
            });
        });
    }

    /**
     * Synchronizes the local operatorOverloading with the language service.
     * The previous operator overloading value is returned.
     */
    synchOperatorOverloading(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (this.languageServiceProxy) {
                const newValue = this.isOperatorOverloadingEnabled();
                this.languageServiceProxy.setOperatorOverloading(newValue)
                    .then((oldValue) => {
                        if (newValue !== oldValue) {
                            this.eventBus.emitAsync(changedOperatorOverloading, new ChangedOperatorOverloadingMessage(oldValue, newValue));
                        }
                        resolve(oldValue);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }
            else {
                reject(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
            }
        });
    }

    synchTsConfig(settings: TsConfigSettings): Promise<TsConfigSettings> {
        return new Promise<TsConfigSettings>((resolve, reject) => {
            this.setTsConfig(settings, function (reason, updatedSettings) {
                if (!reason) {
                    resolve(updatedSettings);
                }
                else {
                    reject(reason);
                }
            });
        });
    }

    /**
     *
     */
    private setTsConfig(settings: TsConfigSettings, callback: (err: any, updatedSettings?: TsConfigSettings) => void): void {
        checkCallback(callback);
        if (this.languageServiceProxy) {
            this.languageServiceProxy.setTsConfig(settings, (err: any, updatedSettings: TsConfigSettings) => {
                callback(err, updatedSettings);
            });
        }
        else {
            callback(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
        }
    }

    setTrace(trace: boolean): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // We won't bother tracking inFlight for tracing.
            if (this.languageServiceProxy) {
                const callback = function (err: any): void {
                    if (!err) {
                        resolve();
                    }
                    else {
                        reject(err);
                    }
                };
                this.languageServiceProxy.setTrace(trace, callback);
            }
            else {
                reject(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
            }
        });
    }

    /**
     * Attaching the Editor to the workspace enables the IDE features.
     */
    attachEditor(path: string, editor: Editor): void {
        if (this.traceLifecycle) {
            console.log(`WsModel.attachEditor(path = ${path})`);
        }
        // The user may elect to open an editor but then leave the workspace as the editor is opening.
        if (this.isZombie()) {
            return;
        }

        // Every time an editor is attached, we increment our self-reference count.
        // This will be countered by a similar call when the editor is detached.
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
            // TODO: How do we remove these later?
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
            // TODO: How do we remove these later?
            editor.commands.addCommand(new AutoCompleteCommand());
            // editor.completers.push(new WorkspaceCompleter(path, this));
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
        if (this.traceLifecycle) {
            console.log(`WsModel.detachEditor(path = ${path})`);
        }
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

    /**
     * 
     */
    private attachSession(path: string, session: EditSession | undefined): void {
        checkPath(path);

        if (session) {
            checkSession(session);
        }
        else {
            return;
        }

        if (isTypeScript(path)) {
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
                session.on(workerCompleted, annotationsHandler);
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

        if (isTypeScript(path)) {
            // Remove Annotation Handlers.
            if (this.annotationHandlers[path]) {
                const annotationHandler = this.annotationHandlers[path];
                session.off(workerCompleted, annotationHandler);
                delete this.annotationHandlers[path];
            }
            else {
                console.warn(`detachSession(${path}) ignored because there is no annotation handler.`);
            }
        }
    }

    /**
     * Begins monitoring the Document at the specified path for changes.
     * TypeScript and JavaScript files are monitored and added to the Language Service.
     * All files are monitored so that changes trigger an update to local storage.
     */
    beginDocumentMonitoring(path: string, callback: (err: any) => any): void {
        if (this.traceLifecycle) {
            console.log(`WsModel.beginDocumentMonitoring(path = ${path})`);
        }
        checkPath(path);
        checkCallback(callback);

        const doc = this.getFileDocument(path);
        if (doc) {
            try {
                checkDocument(doc);

                // Monitoring for Language Analysis.
                if (isTypeScript(path)) {
                    const monitor = new TypeScriptMonitor(path, doc, this);
                    this.docMonitors[path] = monitor;
                    monitor.beginMonitoring(callback);
                }
                else {
                    switch (path) {
                        // I'm assuming that there will not be both kinds of files.
                        case JSPM_DOT_CONFIG_DOT_JS:
                        case JSPM_DOT_CONFIG_DOT_JSON: {
                            const monitor = new JspmConfigJsonMonitor(doc, this);
                            this.docMonitors[path] = monitor;
                            monitor.beginMonitoring(callback);
                            break;
                        }
                        case TSCONFIG_DOT_JSON: {
                            const monitor = new TsConfigJsonMonitor(doc, this);
                            this.docMonitors[path] = monitor;
                            monitor.beginMonitoring(callback);
                            break;
                        }
                        case TSLINT_DOT_JSON: {
                            const monitor = new TsLintJsonMonitor(doc, this);
                            this.docMonitors[path] = monitor;
                            monitor.beginMonitoring(callback);
                            break;
                        }
                        case PACKAGE_DOT_JSON: {
                            const monitor = new PackageJsonMonitor(doc, this);
                            this.docMonitors[path] = monitor;
                            monitor.beginMonitoring(callback);
                            break;
                        }
                        case TYPES_DOT_CONFIG_DOT_JSON: {
                            const monitor = new TypesConfigJsonMonitor(path, doc, this);
                            this.docMonitors[path] = monitor;
                            monitor.beginMonitoring(callback);
                            break;
                        }
                        default: {
                            // console.warn(`No Language Service monitoring for ${path}`);
                            // Fire back the completion asynchronously.
                            window.setTimeout(function () {
                                callback(void 0);
                            }, 0);
                        }
                    }
                }

                // Monitoring for Local Storage.
                const storageHandler = debounce(() => { this.updateStorage(); }, STORE_DELAY_MILLISECONDS);
                this.saveDocumentChangeListenerRemovers[path] = doc.addChangeListener(storageHandler);
            }
            finally {
                doc.release();
            }
        }
        else {
            setTimeout(function () {
                callback(new Error(`Document is missing for path '${path}'`));
            }, 0);
        }
    }

    /**
     * Ends monitoring the Document at the specified path for changes and removes the script from the LanguageService.
     */
    endDocumentMonitoring(path: string, callback: (err: any) => void) {
        if (this.traceLifecycle) {
            console.log(`WsModel.endMonitoring(path = ${path})`);
        }
        try {
            checkPath(path);
            checkCallback(callback);

            const doc = this.getFileDocument(path);
            if (doc) {
                try {
                    checkDocument(doc);

                    if (this.docMonitors[path]) {
                        const monitor = this.docMonitors[path];
                        delete this.docMonitors[path];
                        monitor.endMonitoring(callback);
                    }
                    else {
                        // There is no monitor.
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
            else {
                setTimeout(function () {
                    callback(new Error(`Document is missing for path '${path}'`));
                }, 0);
            }
        }
        catch (e) {
            console.warn(`Exeption while processing endDocumentMonitoring(${path}) ${e}`);
        }
    }

    /**
     * Ends Language Service monitoring on all documents.
     */
    private endMonitoring(): Promise<void> {
        if (this.traceLifecycle) {
            console.log("WsModel.endMonitoring()");
        }
        return new Promise<void>((resolve, reject) => {
            const paths = Object.keys(this.langDocumentChangeListenerRemovers);
            let outstanding = paths.length;
            if (outstanding > 0) {
                for (const path of paths) {
                    this.endDocumentMonitoring(path, function (err) {
                        if (!err) {
                            outstanding--;
                            if (outstanding === 0) {
                                resolve();
                            }
                        }
                        else {
                            console.warn(`endDocumentMonitoring(${path}) => ${err}`);
                        }
                    });
                }
            }
            else {
                // There are no outstanding files to end monitoring on.
                setTimeout(resolve, 0);
            }
        });
    }

    /**
     * Ensures a mapping, in the Language Service, from a module name to a URL.
     * The promise returns the previously mapped-to URL which is expected to be undefined. 
     */
    ensureModuleMapping(moduleName: string, path: string): Promise<string | undefined> {
        if (this.languageServiceProxy) {
            return this.languageServiceProxy.ensureModuleMapping(moduleName, path);
        }
        else {
            return noLanguageServicePromise<string | undefined>();
        }
    }

    /**
     * Removes a mapping, in the Language Service, from a module name to a URL.
     * The promise returns the previously mapped-to URL allowing subsequent script removal. 
     */
    removeModuleMapping(moduleName: string): Promise<string | undefined> {
        if (this.languageServiceProxy) {
            return this.languageServiceProxy.removeModuleMapping(moduleName);
        }
        else {
            return noLanguageServicePromise<string | undefined>();
        }
    }

    /**
     * 
     */
    ensureScript(path: string, content: string, callback: (err: any) => any): void {
        checkPath(path);
        checkCallback(callback);
        if (this.languageServiceProxy) {
            this.languageServiceProxy.ensureScript(path, content, (err: any) => {
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
            this.languageServiceProxy.removeScript(path, (err: any) => {
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
        const paths = this.getFileSessionPaths().filter(isTypeScript);
        const tsLength = paths.length;
        let tsRemaining = tsLength;
        for (const path of paths) {
            const session = this.getFileSession(path);
            if (session) {
                try {
                    this.diagnosticsForSession(path, session, function () {
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
            this.languageServiceProxy.getSyntaxErrors(path, (err: any, syntaxErrors: Diagnostic[]) => {
                if (err) {
                    console.warn(`getSyntaxErrors(${path}) => ${err}`);
                    callback(err);
                }
                else {
                    this.updateSession(path, syntaxErrors, session, 'syntax');
                    if (syntaxErrors.length === 0) {
                        if (this.languageServiceProxy) {
                            this.languageServiceProxy.getSemanticErrors(path, (err: any, semanticErrors: Diagnostic[]) => {
                                if (err) {
                                    console.warn(`getSemanticErrors(${path}) => ${err}`);
                                    callback(err);
                                }
                                else {
                                    this.updateSession(path, semanticErrors, session, 'semantic');
                                    if (semanticErrors.length === 0) {
                                        if (this.linting) {
                                            if (this.languageServiceProxy) {
                                                // TODO
                                                const tslConfig = this.getTsLintSettings();
                                                if (tslConfig) {
                                                    this.languageServiceProxy.getLintErrors(path, tslConfig, (err: any, lintErrors: Diagnostic[]) => {
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
                                            else {
                                                callback(void 0);
                                            }
                                        }
                                        else {
                                            callback(void 0);
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
        for (const path of paths) {
            if (isTypeScript(path)) {
                this.outputFilesForPath(path);
            }
        }
    }

    /**
     * Requests the output files (JavaScript and source maps) for the specified file.
     * The response is published on the outputFilesTopic.
     */
    private outputFilesForPath(path: string): void {
        if (isTypeScript(path)) {
            checkPath(path);
            if (this.languageServiceProxy) {
                this.languageServiceProxy.getOutputFiles(path, (err: any, outputFiles: OutputFile[]) => {
                    if (!err) {
                        this.eventBus.emitAsync(outputFilesTopic, new OutputFilesMessage(outputFiles));
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
        const pkg = this.getPackageSettings();
        if (pkg) {
            return pkg.author;
        }
        else {
            return void 0;
        }
    }

    set author(author: string | undefined) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: PackageSettings = JSON.parse(file.getText());
            setOptionalStringProperty('author', author, metaInfo);
            file.setText(stringifyFileContent(metaInfo));
        }
        finally {
            file.release();
        }
    }

    /**
     * Returns a map from module name to URL.
     */
    getModuleResolutions(): ModuleResolutions {
        // However, if the types.config.json file is present we defer.
        if (this.existsTypesConfigJson()) {
            const settings = this.getTypesConfigSettings();
            if (settings) {
                const map = settings.map;
                if (map) {
                    return map;
                }
                else {
                    return {};
                }
            }
            else {
                throw new Error(`${TYPES_DOT_CONFIG_DOT_JSON}`);
            }
        }
        else {
            return this.moduleResolutionsFromPackageDependencies();
            // this.ensureTypesConfigJson().release();
            // The recursive call will now pull the resolutions from the new file.
            // return this.getModuleResolutions();
        }
    }

    /**
     * Returns a map from module name to URL.
     */
    getAmbientResolutions(): AmbientResolutions {
        // However, if the types.config.json file is present we defer.
        if (this.existsTypesConfigJson()) {
            // This file does not currently provide ambient resolutions.
            // We must rely on the workspace dependencies for now.
            return this.ambientResolutionsFromPackageDependencies();
        }
        else {
            return this.ambientResolutionsFromPackageDependencies();
        }
    }

    /**
     * dependencies is a list of package names, the unique identifier for libraries.
     */
    getPackageDependencies(): { [packageName: string]: string } {
        const pkg = this.getPackageSettings();
        if (pkg) {
            return pkg.dependencies;
        }
        else {
            return {};
        }
    }

    setPackageDependencies(dependencies: { [packageName: string]: string }) {
        try {
            const file = this.ensurePackageJson();
            try {
                const metaInfo: PackageSettings = JSON.parse(file.getText());
                metaInfo.dependencies = dependencies;
                file.setText(stringifyFileContent(metaInfo));
            }
            finally {
                file.release();
            }
        }
        catch (e) {
            console.warn(`Unable to set dependencies property in file '${PACKAGE_DOT_JSON}'.`);
        }
    }

    get description(): string | undefined {
        const pkgInfo = this.getPackageSettings();
        if (pkgInfo) {
            return pkgInfo.description;
        }
        else {
            return void 0;
        }
    }

    set description(description: string | undefined) {
        const file = this.ensurePackageJson();
        try {
            const pkg = this.ensurePackageSettings();
            if (pkg) {
                setOptionalStringProperty('description', description, pkg);
                file.setText(stringifyFileContent(pkg));
            }
        }
        finally {
            file.release();
        }
    }

    get keywords(): string[] {
        const pkg = this.getPackageSettings();
        if (pkg) {
            return pkg.keywords;
        }
        else {
            return [];
        }
    }

    set keywords(keywords: string[]) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: PackageSettings = JSON.parse(file.getText());
            setOptionalStringArrayProperty('keywords', keywords, metaInfo);
            file.setText(stringifyFileContent(metaInfo));
        }
        finally {
            file.release();
        }
    }

    get name(): string | undefined {
        const pkg = this.getPackageSettings();
        if (pkg) {
            return pkg.name;
        }
        else {
            return void 0;
        }
    }

    set name(name: string | undefined) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo = JSON.parse(file.getText()) as PackageSettings;
            metaInfo.name = name;
            file.setText(stringifyFileContent(metaInfo));
        }
        catch (e) {
            console.warn(`Unable to set name property in file '${PACKAGE_DOT_JSON}'.`);
        }
        finally {
            file.release();
        }
    }

    get noLoopCheck(): boolean {
        const pkg = this.getPackageSettings();
        if (pkg) {
            return pkg.noLoopCheck ? true : false;
        }
        else {
            return false;
        }
    }

    set noLoopCheck(noLoopCheck: boolean) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: PackageSettings = JSON.parse(file.getText());
            setOptionalBooleanProperty('noLoopCheck', noLoopCheck, metaInfo);
            file.setText(stringifyFileContent(metaInfo));
        }
        catch (e) {
            console.warn(`Unable to set noLoopCheck property in file '${PACKAGE_DOT_JSON}'.`);
        }
        finally {
            file.release();
        }
    }

    /**
     * Returns the operator overloading setting.
     * Defaults to false if the setting is not defined or cannot be determined.
     */
    isOperatorOverloadingEnabled(): boolean {
        const pkg = this.getPackageSettings();
        if (pkg) {
            return pkg.operatorOverloading ? true : false;
        }
        else {
            return false;
        }
    }

    setOperatorOverloading(operatorOverloading: boolean | undefined) {
        const oldValue = this.isOperatorOverloadingEnabled();
        if (operatorOverloading !== oldValue) {
            const file = this.ensurePackageJson();
            try {
                const pkg = this.ensurePackageSettings();
                if (pkg) {
                    setOptionalBooleanProperty('operatorOverloading', operatorOverloading, pkg);
                    file.setText(stringifyFileContent(pkg));
                }
                else {
                    // The option cannot be applied because the package.json file could not be parsed.
                }
            }
            catch (e) {
                console.warn(`Unable to set operatorOverloading property in file '${PACKAGE_DOT_JSON}'. Cause: ${e}`);
            }
            finally {
                file.release();
            }
        }
    }

    get linting(): boolean {
        if (this.existsPackageJson()) {
            const pkg = this.getPackageSettings();
            if (pkg) {
                return pkg.linting ? true : false;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    set linting(linting: boolean) {
        const oldValue = this.linting;
        if (linting !== oldValue) {
            const file = this.ensurePackageJson();
            try {
                const metaInfo: PackageSettings = JSON.parse(file.getText());
                setOptionalBooleanProperty('linting', linting, metaInfo);
                file.setText(stringifyFileContent(metaInfo));
                this.eventBus.emitAsync(changedLinting, new ChangedLintingMessage(oldValue, linting));
            }
            catch (e) {
                console.warn(`Unable to set linting property in file '${PACKAGE_DOT_JSON}'. Cause: ${e}`);
            }
            finally {
                file.release();
            }
        }
    }

    get version(): string | undefined {
        // 
        if (this.existsPackageJson()) {
            const pkgInfo = this.getPackageSettings();
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
            const metaInfo: PackageSettings = JSON.parse(file.getText());
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
     * Creates a new file.
     * The file is not yet monitored for changes (affecting the Language Service).
     * The file is synchronized with the remote server if the workspace is being shared.
     * The corresponding document changes are hooked up to the collaboration room.
     */
    newFile(path: string): WsFile {
        const file = this.createFileOrRestoreFromTrash(path);
        if (this.room) {
            file.unit = new MwUnit(this, this.mwOptions);
            file.unit.setEditor(file);
            const edits = file.unit.getEdits(this.room.id);
            this.room.setEdits(path, edits);
            this.subscribeRoomToDocumentChanges(path);
        }
        return file;
    }

    /**
     * Creates a new file in the workspace triggered by a room notification.
     * The file is reference counted and must be released.
     */
    createFile(path: string, roomId: string, change: MwChange): WsFile {
        const file = this.createFileOrRestoreFromTrash(path);
        file.unit = new MwUnit(this, this.mwOptions);
        file.unit.setEditor(file);
        file.unit.setChange(roomId, path, change);
        this.subscribeRoomToDocumentChanges(path);
        // Send the delta edits so that the server has our local version.
        if (this.room) {
            const edits = file.unit.getEdits(this.room.id);
            this.room.setEdits(path, edits);
        }
        return file;
    }

    /**
     * Helper function that only provides the file.
     * The file is reference counted and must be released.
     */
    public createFileOrRestoreFromTrash(pathToCreate: string): WsFile {
        const mode = modeFromName(pathToCreate);
        if (!this.existsFile(pathToCreate)) {
            const trashedFile = this.trash ? this.trash.get(pathToCreate) : void 0;
            if (!trashedFile) {
                const file = new WsFile(this);
                file.setText("");
                file.mode = mode;
                if (!this.files) {
                    this.files = new StringShareableMap<WsFile>();
                }
                // The file is captured by the files collection (incrementing the reference count again).
                this.files.put(pathToCreate, file);
                // We return the other reference.
                return file;
            }
            else {
                this.restoreFileFromTrash(pathToCreate);
                trashedFile.mode = mode;
                return trashedFile;
            }
        }
        else {
            throw new Error(`${pathToCreate} already exists. The path must be unique.`);
        }
    }

    /**
     * 1. Ends monitoring of the Document at the specified path.
     * 2. Removes the file from the workspace, placing it in trash if need be for GitHub.
     * 3. Removes the corresponding last known JavaScript.
     * 4. Updates Local Storage.
     * 
     * Asychronicity is caused by the document monitoring using a worker thread.
     * @param path The file identifier.
     * @param master Indicates the origination for this method invocation.
     * 
     * The master flag determines whether nullify edits will be sent to any remotely connected room.
     */
    deleteFile(pathToDelete: string, master: boolean): Promise<void> {
        if (this.traceFileOperations) {
            console.log(`WsModel.deleteFile(path = ${pathToDelete}, master = ${master})`);
        }
        return new Promise<void>((resolve, reject) => {
            const file = this.files ? this.files.getWeakRef(pathToDelete) : void 0;
            if (file) {
                // Determine whether the file exists in GitHub so that we can DELETE it upon upload.
                // Use the raw_url as the sentinel. Keep it in trash for later deletion.
                this.endDocumentMonitoring(pathToDelete, () => {
                    if (file.existsInGitHub) {
                        // It's a file that DOES exist on GitHub. Move it to trash so that it gets synchronized properly.
                        this.moveFileToTrash(pathToDelete);
                    }
                    else {
                        // It's a file that does NOT exist on GitHub. Remove it completely.
                        if (this.files) {
                            this.files.remove(pathToDelete).release();
                        }
                    }
                    delete this.lastKnownJs[pathToDelete];
                    delete this.lastKnownJsMap[pathToDelete];
                    this.updateStorage();
                    resolve();
                });
                // Send a message that the file has been deleted.
                if (this.room && master) {
                    this.unsubscribeRoomFromDocumentChanges(pathToDelete);
                    this.room.deleteFile(pathToDelete);
                }
            }
            else {
                setTimeout(() => {
                    reject(new Error(`deleteFile(${pathToDelete}), ${pathToDelete} was not found.`));
                }, 0);
            }
        });
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
                // We are deleting the file in the role of master.
                this.deleteFile(oldPath, true)
                    .then(() => {
                        // Do nothing
                    })
                    .catch((reason) => {
                        console.warn(`renameFile('${oldPath}', '${newPath}') could not delete the oldFile: ${reason.message}`);
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
    selectFile(pathToSelect: string): void {
        if (this.files) {
            const file = this.files.getWeakRef(pathToSelect);
            if (file) {
                if (file.isOpen) {
                    const paths = this.files.keys;
                    for (const path of paths) {
                        const file = this.files.getWeakRef(path);
                        if (file.isOpen) {
                            file.selected = path === pathToSelect;
                        }
                    }
                }
                this.updateStorage();
            }
        }
    }

    closeFile(pathToClose: string): void {
        if (this.files) {
            const file = this.files.getWeakRef(pathToClose);
            if (file) {
                // The user interface responds to the isOpen flag.
                file.isOpen = false;

                // A file which is closed can't be selected.
                if (file.selected) {
                    file.selected = false;

                    // Select the first open file that we find.
                    const paths = this.files.keys;
                    for (const path of paths) {
                        const file = this.files.getWeakRef(path);
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
            for (const path of paths) {
                const file = this.files.getWeakRef(path);
                file.existsInGitHub = true;
            }
        }
    }

    emptyTrash(): void {
        if (this.trash) {
            const paths = this.trash.keys;
            for (const path of paths) {
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
            for (const path of paths) {
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
                for (const path of paths) {
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
            for (const path of paths) {
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
                for (const path of paths) {
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
     * The caller must release the file when the reference is no longer needed.
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

    /**
     * Returns a weak reference to the Editor corresponding to the specified path.
     * Returns undefined if there is no editor of there is no such file.
     */
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

    /**
     * Returns the edit session corresponding to the specified path.
     * May return undefined if the file does not exist.
     * The caller must release the session when no longer needed.
     */
    private getFileSession(path: string): EditSession | undefined {
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
            const paths = files.keys;
            return paths.filter((path) => {
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
                for (const path of paths) {
                    files.getWeakRef(path).htmlChoice = false;
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
                for (const path of paths) {
                    files.getWeakRef(path).markdownChoice = false;
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
        return this.existsFile(PACKAGE_DOT_JSON);
    }

    /**
     * Ensures that the package.json file exists.
     * Returns the parsed contents.
     * Returns undefined if the contents cannot be parsed as JSON.
     * 
     * TODO: Schema Validation?
     */
    ensurePackageSettings(): PackageSettings | undefined {
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

    /**
     * Returns the PackageSettings provided:
     * 1. The package.json file exists.
     * 2. The package.json file can be parsed.
     */
    getPackageSettings(): PackageSettings | undefined {
        if (this.existsPackageJson()) {
            return this.ensurePackageSettings();
        }
        else {
            return void 0;
        }
    }

    /**
     * The caller must release the file when the reference is no longer needed.
     */
    private ensureTsConfigJson(): WsFile {
        const existingFile = this.findFileByPath(TSCONFIG_DOT_JSON);
        if (!existingFile) {
            const configuration: TsConfigSettings = {
                /**
                 * Encourage use of TypeScript.
                 */
                allowJs: false,
                declaration: true,
                emitDecoratorMetadata: true,
                experimentalDecorators: true,
                jsx: 'react',
                module: 'system',
                noImplicitAny: true,
                noImplicitReturns: true,
                noImplicitThis: true,
                noUnusedLocals: true,
                noUnusedParameters: true,
                // operatorOverloading: true,
                preserveConstEnums: true,
                removeComments: false,
                sourceMap: true,
                strictNullChecks: true,
                suppressImplicitAnyIndexErrors: true,
                target: 'es5',
                traceResolution: true
            };
            const content = stringifyFileContent(configuration);
            return this.ensureFile(TSCONFIG_DOT_JSON, content);
        }
        else {
            return existingFile;
        }
    }

    private ensureTsLintJson(): WsFile {
        const existingFile = this.findFileByPath(TSLINT_DOT_JSON);
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
            return this.ensureFile(TSLINT_DOT_JSON, content);
        }
        else {
            return existingFile;
        }
    }

    /**
     * Returns the parsed tsconfig.json settings.
     * Returns undefined if there is a problem. 
     */
    get tsconfigSettings(): TsConfigSettings | undefined {
        try {
            // Beware: We could have a tsconfig.json that doesn't parse.
            // We must ensure that the user can recover the situation.
            const file = this.ensureTsConfigJson();
            const text = file.getText();
            file.release();
            return JSON.parse(text);
        }
        catch (reason) {
            // TODO: Unfortunately, the JSON parser reports the position as a character offset,
            // but at least the JSON worker puts the error marker in the right place.
            // TODO: The explorer file does not get appropriate highlighting.
            // console.warn(`Unable to parse the ${TSCONFIG_DOT_JSON} file. Reason: ${reason}`);
            return void 0;
        }
    }

    /**
     * 
     */
    getTsLintSettings(): TsLintSettings | undefined {
        try {
            // Beware: We could have a tslint.json that doesn't parse.
            // We must ensure that the user can recover the situation.
            const file = this.ensureTsLintJson();
            const text = file.getText();
            file.release();
            return JSON.parse(text);
        }
        catch (reason) {
            // console.warn(`Unable to parse the ${TSLINT_DOT_JSON} file. Reason: ${reason}`);
            return void 0;
        }
    }

    /**
     * Ensures the existence of a package.json file.
     * If the file does not exist, it will be created with a single empty object content.
     * The caller must release the returned file when the reference is no longer needed.
     */
    private ensurePackageJson(): WsFile {
        return this.ensureFile(PACKAGE_DOT_JSON, '{}');
    }

    private existsTypesConfigJson(): boolean {
        return this.existsFile(TYPES_DOT_CONFIG_DOT_JSON);
    }

    /**
     * This will become a legacy function as we increasingly support external modules.
     * This only returns resolutions for Modular and UMD libraries.
     */
    private moduleResolutionsFromPackageDependencies(): ModuleResolutions {
        const dependencies = this.getPackageDependencies();
        const packageNames = Object.keys(dependencies);
        const options = packageNamesToOptions(packageNames, this.optionManager);
        const resolutions: ModuleResolutions = {};
        for (const option of options) {
            if (option.libraryKind === LibraryKind.Modular || option.libraryKind === LibraryKind.UMD) {
                if (typeof option.moduleName === 'string') {
                    resolutions[option.moduleName] = option.dts;
                }
                else {
                    console.warn(`package '${option.packageName}' is missing a module name.`);
                }
            }
        }
        return resolutions;
    }

    /**
     * This will become a legacy function as we increasingly support external modules.
     * This only returns resolutions for Global libraries.
     */
    private ambientResolutionsFromPackageDependencies(): AmbientResolutions {
        const dependencies = this.getPackageDependencies();
        const packageNames = Object.keys(dependencies);
        const options = packageNamesToOptions(packageNames, this.optionManager);
        const resolutions: AmbientResolutions = {};
        for (const option of options) {
            if (option.libraryKind === LibraryKind.Global) {
                if (typeof option.globalName === 'string') {
                    resolutions[option.globalName] = option.dts;
                }
                else {
                    console.warn(`package '${option.packageName}' is missing a global name.`);
                }
            }
        }
        return resolutions;
    }

    /**
     * The caller must release the file when no longer needed.
     */
    private ensureTypesConfigJson(): WsFile {
        if (!this.existsTypesConfigJson()) {
            const settings: TypesConfigSettings = {
                warnings: true,
                map: this.moduleResolutionsFromPackageDependencies()
            };
            return this.ensureFile(TYPES_DOT_CONFIG_DOT_JSON, JSON.stringify(settings, null, 4));
        }
        else {
            return this.findFileByPath(TYPES_DOT_CONFIG_DOT_JSON) as WsFile;
        }
    }

    getTypesConfigSettings(): TypesConfigSettings | undefined {
        try {
            // Beware: We could have a tsconfig.json that doesn't parse.
            // We must ensure that the user can recover the situation.
            const file = this.ensureTypesConfigJson();
            const text = file.getText();
            file.release();
            return JSON.parse(text);
        }
        catch (reason) {
            // TODO: Unfortunately, the JSON parser reports the position as a character offset,
            // but at least the JSON worker puts the error marker in the right place.
            // TODO: The explorer file does not get appropriate highlighting.
            // console.warn(`Unable to parse the ${TSCONFIG_DOT_JSON} file. Reason: ${reason}`);
            return void 0;
        }
    }

    /**
     * Ensures that a file exists at the specified path, and provides default content.
     * This method is used for ensuring the existence of the package.json and tslint.json files.
     * The caller must release the returned file when the reference is no longer needed.
     * TODO: It would be more efficient for the content to be provided by a function.
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
            return this.findFileByPath(path) as WsFile;
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
        else {
            // TODO: If there is no trash, shouldn't we create a trash bucket?
            console.warn(`WsModel.trashPut(${path}) but there is no trash bucket.`);
        }
    }

    /**
     * Restores a file from trash. The file is not monitored.
     */
    private restoreFileFromTrash(path: string): void {
        const trash = this.trash;
        const files = this.files;
        if (trash) {
            if (files) {
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
            else {
                // TODO: If there is no files, shouldn't we create a files bucket?
                console.warn(`WsModel.restoreFileFromTrash(${path}) but there is no files bucket.`);
            }
        }
        else {
            // We seem to be making an illegal request.
            throw new Error(`WsModel.restoreFileFromTrash(${path}) but there is no trash bucket.`);
        }
    }

    /**
     * 1. Initializes the unit: MwUnit property on each file.
     * 2. Connects each unit to its respective file. (A unit can now read/write a file).
     * 3. Create a listener on the room that can send messages to this workspace.
     * 4. Create listeners on each file that send change events as edits to the room.
     * 5. Maintains a reference to the room until the disconnection happens.
     * 
     * The master flag indicates whether the room was created by this workspace.
     * 
     * @param room The room to connect to.
     * @param master true if the room was created with this workspace as the master.
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
                    file.unit = new MwUnit(this, this.mwOptions);
                    file.unit.setEditor(file);
                }

                // Add a listener to the room agent so that edits broadcast from the room are
                // received by the appropriate unit, converted to patches and applied.
                this.roomListener = new WorkspaceRoomListener(this, this.mwOptions);
                room.addListener(this.roomListener);

                // Add listeners for document changes. These will begin the flow of diffs to the server.
                // We debounce the change events so that the diff is trggered when things go quiet for a second.
                for (const path of paths) {
                    this.subscribeRoomToDocumentChanges(path);
                }
            }
        }
        else {
            throw new TypeError("room must be a RoomAgent.");
        }
    }

    /**
     * Adds a listener to the file document so that changes are sent to the collaboration room.
     * The removal function for the listener is cached to allow for later cleanup.
     * @param path The path of the file document.
     */
    public subscribeRoomToDocumentChanges(path: string): void {
        // We need the document in order to add the change listener.
        const doc = this.getFileDocument(path);
        if (doc) {
            try {
                if (this.files) {
                    const file = this.files.getWeakRef(path);
                    const unit = file.unit;
                    // When the Document emits delta events they get debounced.
                    // When things go quiet, the unit diffs the file against the shadow to create edits.
                    // The edits are sent to the room (server) via the room agent that acts as a proxy.
                    if (this.room) {
                        const changeHandler = debounce(uploadFileEditsToRoom(path, unit, this.room), SYNCH_DELAY_MILLISECONDS);
                        this.roomDocumentChangeListenerRemovers[path] = doc.addChangeListener(changeHandler);
                    }
                }
            }
            finally {
                doc.release();
            }
        }
    }

    /**
     * Stop listening to document changes that gives rise to delta edits for the room.
     */
    unsubscribeRoomFromDocumentChanges(path: string): void {
        // We don't need the document because the remover performs the removal.
        if (this.roomDocumentChangeListenerRemovers[path]) {
            // Calling the remover function removes the change listener from the document.
            this.roomDocumentChangeListenerRemovers[path]();
            delete this.roomDocumentChangeListenerRemovers[path];
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
                for (const path of paths) {
                    this.unsubscribeRoomFromDocumentChanges(path);
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
     * This is called when a room has just been created and needs to be initialized with a workspace.
     * TODO: The room parameter does not seem appropriate because the workspace can only be connected
     * to one room at a time.
     */
    uploadToRoom(room: RoomAgent): void {
        if (room) {
            const files = this.files;
            if (files) {
                const paths = files.keys;
                for (const path of paths) {
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

    /**
     * Determines whether this workspace is currently connected to a room.
     */
    isConnectedToRoom(): boolean {
        const isConnected = !!this.room;
        return isConnected;
    }

    /**
     * Determines whether the owner specified is the owner of the currently connected room.
     * Returns true if there is a room and the owner matches.
     * Returns false if there is a room and the owner does not match.
     * Return undefined if there is no currently connected room.
     */
    isRoomOwner(owner: string): boolean | undefined {
        if (this.room) {
            return this.room.owner === owner;
        }
        else {
            return void 0;
        }
    }
    public applyDelta(path: string, delta: Delta) {
        if (this.languageServiceProxy) {
            this.languageServiceProxy.applyDelta(path, delta, (err: any) => {
                if (!err) {
                    this.updateFileSessionMarkerModels(path, delta);
                    this.updateFileEditorFrontMarkers(path);
                    this.outputFilesForPath(path);
                }
                else {
                    console.warn(LANGUAGE_SERVICE_NOT_AVAILABLE);
                }
            });
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
            this.languageServiceProxy.getFormattingEditsForDocument(path, settings, (err: any, textChanges: TextChange[]) => {
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
            this.languageServiceProxy.getQuickInfoAtPosition(path, position, (err: any, quickInfo: QuickInfo) => {
                callback(err, quickInfo);
            });
        }
    }
}
