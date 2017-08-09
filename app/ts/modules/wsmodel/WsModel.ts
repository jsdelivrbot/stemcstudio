import { Injectable } from '@angular/core';
import { APP_VERSION } from '../../constants';
import { STEMCSTUDIO_WORKSPACE_PATH } from '../../constants';
import { TYPESCRIPT_SERVICES_PATH } from '../../constants';
import { Annotation, AnnotationType } from '../../editor/Annotation';
import { AutoCompleteCommand } from '../../editor/autocomplete/AutoCompleteCommand';
import { ChangedOperatorOverloadingMessage, changedOperatorOverloading } from './IWorkspaceModel';
import { CompletionEntry } from '../../editor/workspace/CompletionEntry';
import { copyWorkspaceToDoodle } from '../../mappings/copyWorkspaceToDoodle';
import { DefinitionInfo } from '../../editor/workspace/DefinitionInfo';
import { Diagnostic } from '../../editor/workspace/Diagnostic';
import { DocumentMonitor } from './monitoring.service';
import { workerCompleted } from '../../editor/EditSession';
import { EventBus } from './EventBus';
import { EventHub } from './EventHub';
import { FormatCodeSettings } from '../../editor/workspace/FormatCodeSettings';
import { get } from '../../editor/lib/net';
import { getPosition, DocumentWithLines } from '../../editor/workspace/getPosition';
import { LanguageServiceProxy } from '../../editor/workspace/LanguageServiceProxy';
import { DoodleManager } from '../../services/doodles/doodleManager.service';
import { IWorkspaceModel } from './IWorkspaceModel';
import { JspmConfigJsonMonitor } from './monitors/JspmConfigJsonMonitor';
import { KeywordCompleter } from '../../editor/autocomplete/KeywordCompleter';
import { Position } from 'editor-document';
import { modeFromName } from '../../utils/modeFromName';
import { LANGUAGE_HTML } from '../../languages/modes';
import { LANGUAGE_MARKDOWN } from '../../languages/modes';
import { MwChange } from '../../synchronization/MwChange';
import { MwEdits } from '../../synchronization/MwEdits';
import { MwOptions } from '../../synchronization/MwOptions';
import { MwUnit } from '../../synchronization/MwUnit';
import { MwWorkspace } from '../../synchronization/MwWorkspace';
import { IOption, LibraryKind } from '../../services/options/IOption';
import { IOptionManager } from '../../services/options/IOptionManager';
import { isLanguageServiceScript } from '../../utils/isLanguageServiceScript';
import { OptionManager } from '../../services/options/optionManager.service';
import { OutputFilesMessage, outputFilesTopic } from './IWorkspaceModel';
import { OutputFile } from '../../editor/workspace/OutputFile';
import { PackageJsonMonitor } from './monitors/PackageJsonMonitor';
import { Range } from '../../editor/Range';
import { RenamedFileMessage, renamedFileTopic } from './IWorkspaceModel';
import { ChangedLintingMessage, changedLinting } from './IWorkspaceModel';
import { RoomAgent } from '../rooms/RoomAgent';
import { RoomListener } from '../rooms/RoomListener';
import { StringShareableMap } from '../../collections/StringShareableMap';
import { TextChange } from '../../editor/workspace/TextChange';
import { TsConfigSettings } from '../tsconfig/TsConfigSettings';
import { TsConfigJsonMonitor } from './monitors/TsConfigJsonMonitor';
import { TsLintSettings, RuleArgumentType } from '../tslint/TsLintSettings';
import { TsLintJsonMonitor } from './monitors/TsLintJsonMonitor';
import { TypesConfigJsonMonitor } from './monitors/TypesConfigJsonMonitor';
import { LanguageServiceScriptMonitor } from './monitors/LanguageServiceScriptMonitor';
import { WsFile } from './WsFile';
import { setOptionalBooleanProperty } from '../../services/doodles/setOptionalBooleanProperty';
import { setOptionalStringProperty } from '../../services/doodles/setOptionalStringProperty';
import { setOptionalStringArrayProperty } from '../../services/doodles/setOptionalStringArrayProperty';
import { WorkspaceRoomListener } from './WorkspaceRoomListener';
import { WorkspaceCompleter } from '../../editor/workspace/WorkspaceCompleter';
import { WorkspaceCompleterHost } from '../../editor/workspace/WorkspaceCompleterHost';
import { Delta } from 'editor-document';
import { Editor } from '../../editor/Editor';
import { EditorService } from '../../editor/EditorService';
import { EditSession } from '../../editor/EditSession';
import { LanguageModeId } from '../../editor/LanguageMode';
import { Marker } from '../../editor/Marker';
import { QuickInfo } from '../../editor/workspace/QuickInfo';
import { QuickInfoTooltip } from '../../editor/workspace/QuickInfoTooltip';
import { QuickInfoTooltipHost } from '../../editor/workspace/QuickInfoTooltipHost';
//
// Choose EditorService implementation (Angular).
// See also editor.directive1x.ts for AngularJS.
//
// import { MonacoEditorService as ConcreteEditorService } from '../../services/editor/monaco-editor.service';
import { NativeEditorService as ConcreteEditorService } from '../../services/editor/native-editor.service';

const NEWLINE = '\n';

/**
 * Used to explore race conditions.
 * Set it to a large value such as 5000 for development.
 * Set it to zero for production.
 */
const SLOW_MOTION_DELAY_MILLIS = 0;

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

/**
 * Mirrors the state of the Language Service cache for ambients or modules.
 */
export class LanguageServiceMirror<T> {
    /**
     * Tracks the number of ambients or modules that are using the specified path.
     * This is used to ensure that scripts are not removed while they are being used.
     */
    private readonly usage: { [path: string]: number } = {};
    /**
     * The mapping of an ambient name or module name to a path.
     * This is used to manage the loading of scripts into the Language Service cache
     */
    private readonly resolutions: T;

    /**
     *
     */
    constructor(resolutions: T) {
        this.resolutions = resolutions;
    }

    /**
     * Returns the names of the modules or hlobal variables.
     */
    names(): string[] {
        return Object.keys(this.resolutions);
    }

    pathForName(name: string): string {
        return this.resolutions[name];
    }

    addMapping(name: string, path: string): number {
        this.resolutions[name] = path;
        return this.incUsage(path);
    }

    removeMapping(name: string, path: string): number {
        delete this.resolutions[name];
        return this.decUsage(path);
    }

    /**
     * Increments the reference count on the resource specified by a path.
     * Returns the reference count after the increment. 
     */
    private incUsage(path: string): number {
        if (typeof this.usage[path] === 'number') {
            this.usage[path] += 1;
        }
        else {
            this.usage[path] = 1;
        }
        return this.usage[path];
    }

    /**
     * Decrements the reference count on the resource specified by the path.
     * Returns the reference count after the decrement. 
     */
    private decUsage(path: string): number {
        if (typeof this.usage[path] === 'number') {
            const usage = this.usage[path];
            if (usage === 1) {
                // Decrement will take it to zero, delete the map entry.
                delete this.usage[path];
                return 0;
            }
            else {
                this.usage[path] = usage + 1;
                return this.usage[path];
            }
        }
        else {
            throw new Error(`decUsage(${path}) must have an existing usage.`);
        }
    }
}

export interface TypesConfigSettings {
    warnings?: boolean;
    /**
     * Not yet supported.
     */
    paths?: { [prefix: string]: string };
    map?: ModuleResolutions;
}

const SYSTEM_DOT_CONFIG_DOT_JS = 'system.config.js';
const SYSTEM_DOT_CONFIG_DOT_JSON = 'system.config.json';

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
    hideConfigFiles: boolean;
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
const systemImports: string[] = ['/jspm_packages/system.js', `/jspm.config.js?version=${APP_VERSION}`];
/**
 * The script imports for initializing the LanguageServiceProxy.
 * The ordering is important because of dependencies.
 */
const scriptImports: string[] = systemImports.concat(TYPESCRIPT_SERVICES_PATH).concat([STEMCSTUDIO_WORKSPACE_PATH]);

/**
 * The worker implementation for the LanguageServiceProxy.
 * TODO: This is currently the same worker that is used for the Language Modes.
 */
const workerUrl = '/js/worker.js';

/**
 * Classify diagnostics so that they can be reported with differing severity (error, warning, or info).
 */
type DiagnosticOrigin = 'syntax' | 'semantic' | 'lint';

export type FileMonitoringEventType = 'addedToLanguageService' | 'removedFromLanguageService';

export interface FileMonitoringData {
    path: string;
}

const LANGUAGE_SERVICE_NOT_AVAILABLE = "Language Service is not available";

/**
 * Returns a promise that will always report an error indicating that
 * the Language Service is not available.
 */
/*
function noLanguageServicePromise<T>(): Promise<T> {
    return new Promise<T>(function (resolve, reject) {
        reject(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
    });
}
*/

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
function diagnosticToAnnotation(doc: DocumentWithLines, diagnostic: Diagnostic, origin: DiagnosticOrigin): Annotation {
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
const appliedDeltaEventName = 'appliedDelta';

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
export class WsModel implements IWorkspaceModel, MwWorkspace, QuickInfoTooltipHost, WorkspaceCompleterHost {

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
     * Exists to persist the visibility state of the code editors.
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
     * Keep track of the dependencies (module names) that are loaded in the Language Service.
     */
    private readonly ambients = new LanguageServiceMirror<AmbientResolutions>({});
    private readonly modulars = new LanguageServiceMirror<ModuleResolutions>({});

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
     * Keep track of files that are in the process of being deleted to thwart race conditions.
     * We might want to eveolve this to some sort of state tracking.
     */
    private readonly deletePending: { [path: string]: boolean } = {};

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
    public readonly changedCompilerSettings = new EventHub<'changedCompilerSettings', TsConfigSettings, WsModel>([changedCompilerSettingsEventName], this);

    /**
     * 
     */
    public readonly changedJspmSettings = new EventHub<'changedJspmSettings', JspmSettings, WsModel>([changedJspmSettingsEventName], this);

    /**
     * A coarse event stream for changes to the tslint.json file because we don't need to differentiate changes to parts. 
     */
    public readonly changedTsLintSettings = new EventHub<'changedLintSettings', TsLintSettings, WsModel>([changedLintSettingsEventName], this);

    /**
     * Events are triggered by the package.json DocumentMonitor.
     * Nobody is currently listening.
     */
    public readonly changedPackageSettings = new EventHub<'changedPackageSettings', PackageSettings, WsModel>([changedPackageSettingsEventName], this);

    /**
     * Events are triggered by the types.config.json DocumentMonitor.
     * The workspace controller responds by updating the Language Service.
     * TODO: Move workspace controller functionality into some sort of pipeline or transformer.
     */
    public readonly changedTypesSettings = new EventHub<'changedTypesSettings', TypesConfigSettings, WsModel>([changedTypesSettingsEventName], this);

    public readonly deltaAppliedEventHub = new EventHub<'appliedDelta', { path: string; delta: Delta; version: number }, WsModel>([appliedDeltaEventName], this);

    /**
     * 'added' means that the file has been added to the language service and is being monitored.
     * 'removed' means that monitoring has ended and the file has been removed from the language service.
     */
    public readonly filesEventHub = new EventHub<FileMonitoringEventType, FileMonitoringData, WsModel>(['addedToLanguageService', 'removedFromLanguageService'], this);

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
     * Use this whenever the method specifies a file `path`.
     */
    private traceFileOperations = false;

    /**
     * The editor service is only used here to create Document and EditSession objects.
     * The creation of Editor objects is the responsibility of UI components.
     * This editor service reference is passed to the WsFile constructor.
     */
    private editorService: EditorService;

    /**
     *
     */
    constructor(private doodles: DoodleManager, private optionManager: OptionManager, editorService: ConcreteEditorService) {
        // This will be called once, lazily, when this class is deployed as a singleton service.
        // We do nothing, much. There is no destructor; it would never be called.
        this.editorService = editorService;
    }

    private logLifecycle(message: string): void {
        console.log(`WsModel.${message}`);
    }

    private languageServiceOrThrow(): LanguageServiceProxy {
        if (this.languageServiceProxy) {
            return this.languageServiceProxy;
        }
        else {
            throw new Error(LANGUAGE_SERVICE_NOT_AVAILABLE);
        }
    }

    /**
     * By accessing the language service through a Promise we ensure
     * that an exception due to a missing language service becomes
     * a rejection.
     */
    private languageService(): Promise<LanguageServiceProxy> {
        if (this.languageServiceProxy) {
            return Promise.resolve(this.languageServiceProxy);
        }
        else {
            return Promise.reject(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
        }
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
            this.logLifecycle(`recycle()`);
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
                this.logLifecycle(`WsModel @waitUntilZeroRefCount`);
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
                this.logLifecycle(`WsModel @waitUntilMonitoringEnded`);
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
                            this.languageServiceProxy.setTrace(this.traceLanguageService)
                                .then((oldTrace) => {
                                    callback(void 0);
                                })
                                .catch(callback);
                        }
                        else {
                            callback(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
                        }
                    }
                    else {
                        callback(err);
                    }
                });
            }
            else {
                callback(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
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
            this.logLifecycle(`dispose()`);
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
            this.logLifecycle(`addRef() @refCount = ${this.refCount}`);
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
            this.logLifecycle(`WsModel @refCount = ${this.refCount}`);
        }
    }

    /**
     * Indicates that someone is dropping a reference to this workspace.
     * The fact that this method is private reflects the use of recycle/dispose.
     */
    private release(): void {
        if (this.traceLifecycle) {
            this.logLifecycle(`release() @refCount = ${this.refCount}`);
        }
        this.refCount--;
        if (this.refCount === 0) {
            // We can't return the Promise and wait so we set a property
            this.waitUntilMonitoringEnded = new Promise<void>((resolve, reject) => {
                this.endMonitoring()
                    .then(() => {
                        if (this.traceLifecycle) {
                            this.logLifecycle(`WsModel Language Service monitoring has ended.`);
                        }
                        this.eventBus.reset();
                        this.cleanLanguageService()
                            .then(() => {
                                this.languageServiceOrThrow().terminate();
                                this.languageServiceProxy = void 0;
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
                            .catch((err) => {
                                reject(err);
                            });
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
            this.logLifecycle(`WsModel @refCount = ${this.refCount}`);
        }
    }

    /**
     * Remove d.ts files that we have added to the Language Service.
     */
    private cleanLanguageService(): Promise<any> {
        if (this.traceLifecycle) {
            this.logLifecycle(`cleanLangaugeService()`);
        }
        const todos: Promise<any>[] = [];
        for (const moduleName of this.modulars.names()) {
            todos.push(this.removeModule(moduleName));
        }
        for (const globalName of this.ambients.names()) {
            todos.push(this.removeAmbient(globalName));
        }
        return Promise.all(todos);
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
    setDefaultLibrary(url: string) {
        const setDefaultLibContent = (sourceCode: string) => {
            return this.languageServiceOrThrow().setDefaultLibContent(sourceCode);
        };
        return get(url).then(setDefaultLibContent);
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

    /**
     * Returns a promise containing the updated settings.
     */
    synchTsConfig(settings: TsConfigSettings): Promise<TsConfigSettings> {
        return this.languageService().then(languageService => languageService.setTsConfig(settings));
    }

    /**
     * Sets the trace flag in the language service worker and returns the old trace value.
     */
    setTrace(trace: boolean): Promise<boolean> {
        return this.languageService().then(languageService => languageService.setTrace(trace));
    }

    /**
     * Attaching the Editor to the workspace enables the IDE features.
     */
    attachEditor(path: string, editor: Editor): void {
        if (this.traceFileOperations) {
            this.logLifecycle(`attachEditor(path = ${path})`);
        }
        // The user may elect to open an editor but then leave the workspace as the editor is opening.
        if (this.isZombie()) {
            return;
        }

        // Every time an editor is attached, we increment our self-reference count.
        // This will be countered by a similar call when the editor is detached.
        this.addRef();

        checkPath(path);

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
        if (isLanguageServiceScript(path)) {
            // Enable auto completion using the workspace.
            // The command seems to be required on order to enable method completion.
            // However, it has the side-effect of enabling global completions (Ctrl-Space, etc).
            // TODO: How do we remove these later?
            editor.addCommand(new AutoCompleteCommand());
            editor.addCompleter(new WorkspaceCompleter(path, this));

            // Finally, enable QuickInfo.
            const quickInfo = editor.createQuickInfoTooltip(path, this);
            if (quickInfo) {
                quickInfo.init();
                this.quickInfo[path] = quickInfo;
            }
        }
        else if (isHtmlScript(path)) {
            editor.addCommand(new AutoCompleteCommand());
            editor.addCompleter(new KeywordCompleter());
        }
        else {
            editor.addCommand(new AutoCompleteCommand());
            editor.addCompleter(new KeywordCompleter());
        }

        this.attachSession(path, editor.getSession());
    }

    /**
     * Detaching the Editor from the workspace disables the IDE features.
     */
    detachEditor(path: string, editor: Editor): void {
        if (this.traceFileOperations) {
            this.logLifecycle(`detachEditor(path = ${path})`);
        }
        if (this.isZombie()) {
            return;
        }
        try {
            checkPath(path);

            this.setFileEditor(path, void 0);

            if (isLanguageServiceScript(path)) {
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
     * If the path corresponds to a TypeScript file, we wire up the completion
     * of the editor worker to refresh the diagnostics.
     */
    private attachSession(path: string, session: EditSession | undefined): void {
        if (this.traceFileOperations) {
            this.logLifecycle(`attachSession(path = "${path}")`);
        }
        checkPath(path);

        if (!session) {
            return;
        }

        if (isLanguageServiceScript(path)) {
            if (!this.annotationHandlers[path]) {

                /**
                 * Wrapper to throttle requests for semantic errors.
                 */
                const refreshDiagnosticsDebounced = debounce(() => {
                    this.refreshDiagnostics().catch(function (err) {
                        console.warn(`Error returned from request for diagnostics for path => ${path}: ${err}`);
                    });
                }, SEMANTIC_DELAY_MILLISECONDS);

                // When the LanguageMode has completed syntax analysis, it emits annotations.
                // This is our cue to begin semantic analysis and make use of transpiled files.
                /**
                 * Handler for annotations received from the language worker thread.
                 * Since this is TypeScript, the annotations will always have zero length
                 * because the editor worker does not do anything (the syntactic and semantic
                 * work is done by the workspace worker).
                 */
                const annotationsHandler = (event: { data: Annotation[], type: 'annotation' }) => {
                    // Only make the request for semantic errors if there are no syntactic errors.
                    // This doesn't make a lot of sense because we only consider one file.
                    const annotations = event.data;
                    if (annotations.length === 0) {
                        // A change in a single file triggers analysis of all files.
                        refreshDiagnosticsDebounced();
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

    /**
     * If the path corresponds to a TypeScript file, we unhook the link that caused
     * a worker completion event to trigger a refresh of the diagnostics.
     */
    private detachSession(path: string, session: EditSession | undefined) {
        if (this.traceFileOperations) {
            this.logLifecycle(`detachSession(path = "${path}")`);
        }
        checkPath(path);

        if (!session) {
            return;
        }

        if (isLanguageServiceScript(path)) {
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
        if (this.traceFileOperations) {
            this.logLifecycle(`beginDocumentMonitoring(path = "${path}")`);
        }
        checkPath(path);
        checkCallback(callback);

        const session = this.getFileSession(path);
        if (session) {
            try {
                // Monitoring for Language Analysis.
                if (isLanguageServiceScript(path)) {
                    const monitor = new LanguageServiceScriptMonitor(path, session, this);
                    this.docMonitors[path] = monitor;
                    monitor.beginMonitoring(callback);
                }
                else {
                    switch (path) {
                        // I'm assuming that there will not be both kinds of files.
                        case SYSTEM_DOT_CONFIG_DOT_JS:
                        case SYSTEM_DOT_CONFIG_DOT_JSON: {
                            const monitor = new JspmConfigJsonMonitor(session, this);
                            this.docMonitors[path] = monitor;
                            monitor.beginMonitoring(callback);
                            break;
                        }
                        case TSCONFIG_DOT_JSON: {
                            const monitor = new TsConfigJsonMonitor(session, this);
                            this.docMonitors[path] = monitor;
                            monitor.beginMonitoring(callback);
                            break;
                        }
                        case TSLINT_DOT_JSON: {
                            const monitor = new TsLintJsonMonitor(session, this);
                            this.docMonitors[path] = monitor;
                            monitor.beginMonitoring(callback);
                            break;
                        }
                        case PACKAGE_DOT_JSON: {
                            const monitor = new PackageJsonMonitor(session, this);
                            this.docMonitors[path] = monitor;
                            monitor.beginMonitoring(callback);
                            break;
                        }
                        case TYPES_DOT_CONFIG_DOT_JSON: {
                            const monitor = new TypesConfigJsonMonitor(path, session, this);
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
                this.saveDocumentChangeListenerRemovers[path] = session.addChangeListener(storageHandler);
            }
            finally {
                session.release();
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
        if (this.traceFileOperations) {
            this.logLifecycle(`endDocumentMonitoring(path = "${path}")`);
        }
        try {
            checkPath(path);
            checkCallback(callback);

            // TODO: Why do we do this? 
            const session = this.getFileSession(path);
            if (session) {
                try {

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
                    session.release();
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
            this.logLifecycle("WsModel.endMonitoring()");
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

    addAmbient(globalName: string, path: string, content: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.addScript(path, content)
                .then((added) => {
                    this.ambients.addMapping(globalName, path);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    removeAmbient(globalName: string): Promise<boolean> {
        if (this.traceLifecycle) {
            this.logLifecycle(`removeAmbient(globalName = "${globalName}")`);
        }
        return new Promise<boolean>((resolve, reject) => {
            const path = this.ambients.pathForName(globalName);
            this.removeScript(path)
                .then((removed) => {
                    if (removed) {
                        this.ambients.removeMapping(globalName, path);
                        resolve(removed);
                    }
                    else {
                        reject(new Error(`removeAmbient(${globalName}) but ${path} does not exist.`));
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * 
     */
    addModule(moduleName: string, path: string, content: string): Promise<{ previous: string | undefined; added: boolean }> {
        if (this.traceLifecycle) {
            this.logLifecycle(`addModule('${moduleName}', '${path}')`);
        }
        return new Promise<{ previous: string | undefined; added: boolean }>((resolve, reject) => {
            if (this.languageServiceProxy) {
                this.languageServiceProxy.setScriptContent(path, content)
                    .then((added) => {
                        if (this.languageServiceProxy) {
                            this.languageServiceProxy.ensureModuleMapping(moduleName, path)
                                .then((previous) => {
                                    this.modulars.addMapping(moduleName, path);
                                    if (added) {
                                        this.filesEventHub.emitAsync('addedToLanguageService', { path });
                                    }
                                    resolve({ previous, added });
                                })
                                .catch(function (err) {
                                    reject(new Error(`addModule(${moduleName}) failed. ${err}`));
                                });
                        }
                        else {
                            reject(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
                        }
                    })
                    .catch((err) => {
                        reject(new Error(`addModule(${path}) failed. Cause: ${err}`));
                    });
            }
            else {
                reject(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
            }
        });
    }

    /**
     * Removes a mapping, in the Language Service, from a module name to a URL.
     * The promise returns the previously mapped-to URL allowing subsequent script removal. 
     */
    removeModule(moduleName: string): Promise<{ previous: string | undefined; removed: boolean }> {
        if (this.traceLifecycle) {
            this.logLifecycle(`removeModule('${moduleName}')`);
        }
        return new Promise<{ previous: string | undefined; removed: boolean }>((resolve, reject) => {
            if (this.languageServiceProxy) {
                this.languageServiceProxy.removeModuleMapping(moduleName)
                    .then((previous) => {
                        const path = this.modulars.pathForName(moduleName);
                        const refCount = this.modulars.removeMapping(moduleName, path);
                        if (refCount === 0) {
                            this.removeScript(path)
                                .then(function (removed) {
                                    resolve({ previous, removed });
                                })
                                .catch(function (err) {
                                    reject(err);
                                });
                        }
                        else {
                            resolve({ previous, removed: false });
                        }
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

    /**
     * Synchronization method to add a script to the Language Service.
     * TODO: Rename the `path` parameter to `moduleName`?
     */
    addScript(path: string, content: string): Promise<boolean> {
        if (this.traceFileOperations) {
            this.logLifecycle(`addScript(path = "${path}")`);
        }
        return new Promise<boolean>((resolve, reject) => {
            if (this.languageServiceProxy) {
                this.languageServiceProxy.setScriptContent(path, content)
                    .then((added) => {
                        if (added) {
                            this.filesEventHub.emitAsync('addedToLanguageService', { path });
                            resolve(added);
                        }
                        else {
                            reject(new Error(`addScript(${path}) returned ${added}: ${typeof added}, indicating that the script ${path} already exists.`));
                        }
                    })
                    .catch((err) => {
                        reject(new Error(`addScript(${path}) failed. Cause: ${err}`));

                    });
            }
            else {
                throw new Error(LANGUAGE_SERVICE_NOT_AVAILABLE);
            }
        });
    }

    /**
     * Synchronization method to remove a script from the Language Service.
     * This is called in two different contexts:
     * When a user has finished with a code script and monitoring ends.
     * When the ambient or module type information changes.
     * The main difference between these two is that user code is monitored for document changes.
     * The promise returns the following:
     * true if the script exists and was successfully removed.
     * false if the script does not exist (idempotency). A warning is logged.
     * error if something goes wrong.
     */
    removeScript(path: string): Promise<boolean> {
        if (this.traceFileOperations) {
            this.logLifecycle(`removeScript(path = "${path}")`);
        }
        return new Promise<boolean>((resolve, reject) => {
            if (this.languageServiceProxy) {
                this.languageServiceProxy.removeScript(path)
                    .then((removed) => {
                        if (removed) {
                            this.filesEventHub.emitAsync('removedFromLanguageService', { path });
                            resolve(removed);
                        }
                        else {
                            reject(new Error(`removeScript(${path}) returned ${removed} indicating that ${path} does not exist.`));
                        }
                    })
                    .catch((err) => {
                        reject(new Error(`removeScript(${path}) failed. Cause: ${err}`));
                    });
            }
            else {
                reject(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
            }
        });
    }

    /**
     * Requests the diagnostics for all edit sessions.
     * The results are used to update the corresponding edit session objects.
     * This is called when...
     * 1. The user has updated the workspace type information (Settings).
     * 2. The workspace controller does a compile.
     * 3. When a TypeScript editor's worker has completed.
     * 
     * TODO: The returned promise is not very useful unless the dianostics can be mapped to each path.
     */
    public refreshDiagnostics(): Promise<Diagnostic[][]> {
        // console.lg("WsModel.refreshDiagnostics() called.");
        const paths = this.getFileSessionPaths().filter(isLanguageServiceScript);
        const diagnosticPromises: Promise<Diagnostic[]>[] = [];
        for (const path of paths) {
            if (this.deletePending[path]) {
                // This is a race condition.
                // We simply ignore the request for this path because the diagnostics would have no use.
                // But let's make sure that the callback gets made.
            }
            else {
                const session = this.getFileSession(path);
                if (session) {
                    try {
                        diagnosticPromises.push(this.diagnosticsForSession(path, session));
                    }
                    finally {
                        session.release();
                    }
                }
            }
        }
        return Promise.all(diagnosticPromises);
    }

    /**
     * Transfers the diagnostic information to the appropriate edit session.
     */
    private updateSession(path: string, diagnostics: Diagnostic[], session: EditSession, origin: DiagnosticOrigin): void {
        if (this.traceFileOperations) {
            this.logLifecycle(`updateSession(path = "${path}")`);
        }
        // We have the path and diagnostics, so we should be able to provide hyperlinks to errors.
        if (!session) {
            return;
        }

        const file = this.getFileWeakRef(path);
        if (file) {
            file.tainted = false;
        }

        const annotations = diagnostics.map(function (diagnostic) {
            if (file) {
                file.tainted = true;
            }
            return diagnosticToAnnotation(session, diagnostic, origin);
        });
        session.setAnnotations(annotations);

        this.errorMarkerIds.forEach(function (markerId) { session.removeMarker(markerId); });


        // Add highlighting markers to the text.
        const markerClass = diagnosticOriginToMarkerClass(origin);
        diagnostics.forEach((diagnostic) => {
            const minChar = diagnostic.start;
            const limChar = minChar + diagnostic.length;
            const start = getPosition(session, minChar);
            const end = getPosition(session, limChar);
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
    private diagnosticsForSession(path: string, session: EditSession): Promise<Diagnostic[]> {
        if (this.traceFileOperations) {
            this.logLifecycle(`diagnosticsForSession(path = "${path}")`);
        }
        return new Promise<Diagnostic[]>((resolve, reject) => {
            if (this.languageServiceProxy) {
                this.languageServiceProxy.getSyntaxErrors(path, (err: any, syntaxErrors: Diagnostic[]) => {
                    if (err) {
                        reject(new Error(`getSyntaxErrors(${path}) failed. Cause: ${err}`));
                    }
                    else {
                        this.updateSession(path, syntaxErrors, session, 'syntax');
                        if (syntaxErrors.length === 0) {
                            if (this.languageServiceProxy) {
                                this.languageServiceProxy.getSemanticErrors(path, (err: any, semanticErrors: Diagnostic[]) => {
                                    if (err) {
                                        reject(new Error(`getSemanticErrors(${path}) failed. Cause: ${err}`));
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
                                                                reject(new Error(`getLintErrors(${path}) failed. Cause: ${err}`));
                                                            }
                                                            else {
                                                                this.updateSession(path, lintErrors, session, 'lint');
                                                                resolve(lintErrors);
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        // The lint settings are not available, maybe a parse error in tslint.json.
                                                        resolve([]);
                                                    }
                                                }
                                                else {
                                                    reject(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
                                                }
                                            }
                                            else {
                                                // The linting flag is off so there are no lint errors.
                                                resolve([]);
                                            }
                                        }
                                        else {
                                            resolve(semanticErrors);
                                        }
                                    }
                                });
                            }
                            else {
                                reject(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
                            }
                        }
                        else {
                            resolve(syntaxErrors);
                        }
                    }
                });
            }
            else {
                reject(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
            }
        });
    }

    /**
     * Requests the output files (JavaScript and source maps) for all files that are transpiled.
     * The responses are published on the outputFilesTopic.
     */
    public outputFiles(): void {
        const paths = this.getFileSessionPaths();
        for (const path of paths) {
            if (isLanguageServiceScript(path)) {
                this.outputFilesForPath(path);
            }
        }
    }

    /**
     * Requests the output files (JavaScript and source maps) for the specified file.
     * The response is published on the outputFilesTopic.
     */
    public outputFilesForPath(path: string): void {
        if (this.traceFileOperations) {
            this.logLifecycle(`outputFilesForPath(path = "${path}")`);
        }
        if (this.deletePending[path]) {
            // This is a race condition.
            // TODO: By ignoring it, we are assuming that there is at least one TypeScript file
            // in the workspace that will cause output files to be created. We should make sure
            // that when there are zero files in the project, an event is emitted that says there
            // are no output files. Test this by deleting the main.ts file.
        }
        else {
            if (isLanguageServiceScript(path)) {
                checkPath(path);
                if (this.languageServiceProxy) {
                    if (this.traceFileOperations) {
                        this.logLifecycle(`getOutputFiles(path = "${path}")`);
                    }
                    this.languageServiceProxy.getOutputFiles(path, (err: any, data: { fileName: string, version: number, outputFiles: OutputFile[] }) => {
                        if (!err) {
                            const fileName = data.fileName;
                            const version = data.version;
                            const outputFiles = data.outputFiles;
                            if (this.traceFileOperations) {
                                const names = outputFiles.map(function (outputFile) { return outputFile.name; });
                                this.logLifecycle(`received response to getOutputFiles(path = "${path}") names = ${JSON.stringify(names)}`);
                            }
                            this.eventBus.emitAsync(outputFilesTopic, new OutputFilesMessage(fileName, version, outputFiles));
                        }
                        else {
                            // TODO: Why do we get...
                            // TypeError: Cannot read property 'text' of undefined
                            // This happens while typing "import {"
                            // See EVENT_GET_OUTPUT_FILES (no surprise)
                            // I think it is because we are trying to get output files
                            // while there is a syntax error.
                        }
                    });
                }
            }
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
     * TODO: Temporary pending refactoring.
     */
    getModulesLoaded(): LanguageServiceMirror<ModuleResolutions> {
        return this.modulars;
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
     * TODO: Temporary pending refactoring.
     */
    getAmbientsLoaded(): LanguageServiceMirror<AmbientResolutions> {
        return this.ambients;
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

    get hideConfigFiles(): boolean {
        const pkg = this.getPackageSettings();
        if (pkg) {
            return pkg.hideConfigFiles ? true : false;
        }
        else {
            return false;
        }
    }

    set hideConfigFiles(hideConfigFiles: boolean) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: PackageSettings = JSON.parse(file.getText());
            setOptionalBooleanProperty('hideConfigFiles', hideConfigFiles, metaInfo);
            file.setText(stringifyFileContent(metaInfo));
        }
        catch (e) {
            console.warn(`Unable to set hideConfigFiles property in file '${PACKAGE_DOT_JSON}'.`);
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
     * This should become the new public API, replacing newFile.
     */
    newFileWithDocumentMonitoring(path: string, isExternal: boolean): Promise<WsFile> {
        const file = this.newFileUnmonitored(path, isExternal);
        return new Promise<WsFile>((resolve, reject) => {
            this.beginDocumentMonitoring(path, (err) => {
                if (!err) {
                    resolve(file);
                }
                else {
                    file.release();
                    reject(err);
                }
            });
        });
    }

    /**
     * Creates a new file.
     * The file is not yet monitored for changes (affecting the Language Service).
     * The file is synchronized with the remote server if the workspace is being shared.
     * The corresponding document changes are hooked up to the collaboration room.
     * The file is reference counted and must be released.
     */
    newFileUnmonitored(path: string, isExternal: boolean): WsFile {
        if (this.traceFileOperations) {
            this.logLifecycle(`newFile(path = "${path}", isExternal = ${JSON.stringify(isExternal)})`);
        }
        const file = this.createFileOrRestoreFromTrash(path, isExternal);
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
        // TODO: Is it possible to create a file which is external?
        const file = this.createFileOrRestoreFromTrash(path, false);
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
    public createFileOrRestoreFromTrash(path: string, isExternal: boolean): WsFile {
        if (this.traceFileOperations) {
            this.logLifecycle(`createFileOrRestoreFromTrash(path = ${path}, isExternal = ${isExternal})`);
        }
        const mode = modeFromName(path);
        if (!this.existsFile(path)) {
            const trashedFile = this.trash ? this.trash.get(path) : void 0;
            if (!trashedFile) {
                const file = new WsFile(isExternal, this, this.editorService);
                file.setText("");
                file.mode = mode;
                if (!this.files) {
                    this.files = new StringShareableMap<WsFile>();
                }
                // The file is captured by the files collection (incrementing the reference count again).
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
     * 
     * Asychronicity is caused by the document monitoring using a worker thread.
     * @param path The file identifier.
     * @param master Indicates the origination for this method invocation.
     * 
     * The master flag determines whether nullify edits will be sent to any remotely connected room.
     */
    deleteFile(path: string, master: boolean): Promise<void> {
        if (this.traceFileOperations) {
            this.logLifecycle(`deleteFile(path = ${path}, master = ${master})`);
        }
        return new Promise<void>((resolve, reject) => {
            const file = this.files ? this.files.getWeakRef(path) : void 0;
            if (file) {
                this.deletePending[path] = true;
                // Determine whether the file exists in GitHub so that we can DELETE it upon upload.
                // Use the raw_url as the sentinel. Keep it in trash for later deletion.
                this.endDocumentMonitoring(path, (err) => {
                    // We intentionally magnify a race condition here.
                    // When some listeners receive the event that the file has been removed
                    // from the Language Service, they will initiate a compile.
                    // What happens if we try to get diagnostics on a file in the workspace
                    // that no longer exists in the Language Service?
                    window.setTimeout(() => {
                        // The fact that the following method call is synchronous ensures
                        // that the clearing of the delete pending tally happens in synch.
                        this.expungeFile(file, path);
                        delete this.deletePending[path];
                        resolve();
                    }, SLOW_MOTION_DELAY_MILLIS);
                });
                // Send a message that the file has been deleted.
                if (this.room && master) {
                    this.unsubscribeRoomFromDocumentChanges(path);
                    this.room.deleteFile(path);
                }
            }
            else {
                setTimeout(() => {
                    reject(new Error(`deleteFile(${path}), ${path} was not found.`));
                }, 0);
            }
        });
    }

    private deleteFileUnmonitored(path: string, master: boolean): Promise<void> {
        if (this.traceFileOperations) {
            this.logLifecycle(`deleteFileUnmonitored(path = ${path}, master = ${master})`);
        }
        return new Promise<void>((resolve, reject) => {
            const file = this.files ? this.files.getWeakRef(path) : void 0;
            if (file) {
                this.deletePending[path] = true;
                // We intentionally magnify a race condition here.
                // When some listeners receive the event that the file has been removed
                // from the Language Service, they will initiate a compile.
                // What happens if we try to get diagnostics on a file in the workspace
                // that no longer exists in the Language Service?
                window.setTimeout(() => {
                    // The fact that the following method call is synchronous ensures
                    // that the clearing of the delete pending tally happens in synch.
                    this.expungeFile(file, path);
                    delete this.deletePending[path];
                    resolve();
                }, SLOW_MOTION_DELAY_MILLIS);
                // Send a message that the file has been deleted.
                if (this.room && master) {
                    this.unsubscribeRoomFromDocumentChanges(path);
                    this.room.deleteFile(path);
                }
            }
            else {
                setTimeout(() => {
                    reject(new Error(`deleteFileUnmonitored(${path}), ${path} was not found.`));
                }, 0);
            }
        });
    }

    /**
     * 1. Moves the file to trash (if it was originally from GitHub), or removes it from the list of files.
     * 2. Updates Local Storage.
     * 
     * This method is synchronous.
     * 
     * TODO: Update to Local Storage should be decoupled.
     */
    private expungeFile(file: WsFile, pathToDelete: string): void {
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

    }

    /**
     * Determines whether a file exists with the specified path.
     * 
     * Throws an Error if the path is not a string.
     */
    existsFile(path: string): boolean {
        if (typeof path !== 'string') {
            throw new Error("path must be a string");
        }
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
     * 
     */
    renameFile(oldPath: string, newPath: string): Promise<void> {
        if (this.traceFileOperations) {
            this.logLifecycle(`renameFile(oldPath = ${oldPath}, newPath = ${newPath})`);
        }
        // TODO: Refactor to remove the nesting.
        // Thhis will require fixing the monitoring calls.
        return new Promise<void>((resolve, reject) => {
            this.endDocumentMonitoring(oldPath, (endMonitoringError) => {
                if (!endMonitoringError) {
                    // TODO: Where is the Promise?
                    this.renameUnmonitoredFile(oldPath, newPath)
                        .then(() => {
                            this.beginDocumentMonitoring(newPath, (beginMonitoringError) => {
                                if (!beginMonitoringError) {
                                    resolve();
                                }
                                else {
                                    reject(beginMonitoringError);
                                }
                            });

                        })
                        .catch((renameError) => {
                            reject(renameError);
                        });
                }
                else {
                    reject(endMonitoringError);
                }
            });
        });
    }

    /**
     * Creates a new file in the unmonitored state.
     */
    private createUnmonitoredFile(newPath: string, text: string, isOpen: boolean, selected: boolean, mode: LanguageModeId): Promise<void> {
        if (this.traceFileOperations) {
            this.logLifecycle(`createUnmonitoredFile(newPath = ${newPath}, mode = ${mode})`);
        }
        return new Promise<void>((resolve, reject) => {
            // Determine whether we can recycle a file from trash or must create a new file.
            if (!this.existsFileInTrash(newPath)) {

                // We must create a new file.
                const newFile = this.newFileUnmonitored(newPath, false);

                newFile.setText(text);
                newFile.isOpen = isOpen;
                newFile.selected = selected;

                // Make it clear that this file did not come from GitHub.
                newFile.existsInGitHub = false;

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
                    theFile.setText(text);
                    theFile.isOpen = isOpen;
                    theFile.selected = selected;
                    theFile.mode = mode;
                }
            }
            resolve();
        });
    }

    /**
     * Renames a file.
     * The file should not be being monitored.
     * The file (renamed) will not be monitored.
     * 
     * TODO: Better that this be a private method and that the workspace does the right thing.
     */
    private renameUnmonitoredFile(oldPath: string, newPath: string): Promise<void> {
        if (this.traceFileOperations) {
            this.logLifecycle(`renameUnmonitoredFile(oldPath = ${oldPath}, newPath = ${newPath})`);
        }
        return new Promise<void>((resolve, reject) => {
            const mode = modeFromName(newPath);
            if (mode) {
                // Make sure that the file we want to re-path really does exist.
                const oldFile = this.files ? this.files.getWeakRef(oldPath) : void 0;
                if (oldFile) {
                    // We're now in the clear to proceed.
                    if (!this.existsFile(newPath)) {

                        this.createUnmonitoredFile(newPath, oldFile.getText(), oldFile.isOpen, oldFile.selected, mode)
                            .then(() => {
                                return this.deleteFileUnmonitored(oldPath, true);
                            })
                            .then(() => {
                                // TODO: This could be decoupled by using an EventHub.
                                // {begin, path} triggers wsModel.outputFilesForPath()
                                this.eventBus.emit(renamedFileTopic, new RenamedFileMessage(oldPath, newPath));
                                this.outputFilesForPath(newPath);
                                return Promise.resolve();
                            })
                            .then(() => {
                                resolve();
                            })
                            .catch((reason) => {
                                console.warn(`renameUnmonitoredFile('${oldPath}', '${newPath}') failed. Reason: ${reason}`);
                            });
                    }
                    else {
                        reject(new Error(`${newPath} already exists. The new path must be unique.`));
                    }
                }
                else {
                    reject(new Error(`${oldPath} does not exist. The old path must be the path of an existing file.`));
                }
            }
            else {
                reject(new Error(`${newPath} is not a recognized language.`));
            }
        });
    }

    /**
     * Navigates to the specified file and position withing that file.
     * The file may be internal to the workspace, or it may be an external URL, usually for a d.ts file.
     * The external file should be found in the Language Service.
     * External files may be loaded and marked as external allowing them to be browsed but not saved.
     */
    navigateToFileAndPosition(path: string, position: Position): void {
        if (this.traceFileOperations) {
            this.logLifecycle(`navigateToFileAndPosition(path = "${path}", position = ${JSON.stringify(position)})`);
        }
        this.ensureFileExists(path)
            .then((file) => {
                this.openFile(path);
                this.selectFile(path);
                // We can't expect the Editor to have been created.
                // We subscribe for events relating to the editor.
                // When the editor is attached, set the position and unsubscribe.
                // TODO: Another way to do this would be to leave a "package" for the editor when it arrives at the file.
                // A general way to do this would be to leave a list of commands.
                const subscription = file.editorEvents.subscribe(({ oldEditor, newEditor }) => {
                    if (newEditor) {
                        newEditor.scrollCursorIntoView(position);
                        subscription.unsubscribe();
                    }
                });
                file.release();
            })
            .catch((reason) => {
                console.warn(`navigateToFileAndPosition(path = "${path}", position = ${JSON.stringify(position)}) failed. Reason: ${reason}`);
            });
    }

    /**
     * Ensures that a file exists in the workspace whether it be an internal file or an external reference.
     * The returned file is reference counted and must be released by the caller.
     */
    private ensureFileExists(path: string): Promise<WsFile> {
        if (this.traceFileOperations) {
            this.logLifecycle(`ensureFileExists(path = "${path}")`);
        }
        if (this.files) {
            const file = this.files.get(path);
            if (file) {
                return Promise.resolve(file);
            }
            else {
                return this.loadFileFromLanguageService(path);
            }
        }
        else {
            return this.loadFileFromLanguageService(path);
        }
    }

    /**
     * Loads a file from a URL into the workspace.
     * The returned file is reference counted and must be released by the caller.
     */
    /*
    private loadExternalFile(url: string): Promise<WsFile> {
        return new Promise<WsFile>((resolve, reject) => {
            get(url)
                .then((text) => {
                    // TODO: Need to mark the file as external.
                    const file = this.newFile(url);
                    file.setText(text);
                    resolve(file);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    */

    private loadFileFromLanguageService(path: string): Promise<WsFile> {
        if (this.traceFileOperations) {
            this.logLifecycle(`loadFileFromLanguageService(path = "${path}")`);
        }
        return new Promise<WsFile>((resolve, reject) => {
            this.languageService()
                .then((languageService) => {
                    languageService.getScriptContent(path)
                        .then((text) => {
                            const file = this.newFileUnmonitored(path, true);
                            file.setText(text);
                            resolve(file);
                        })
                        .catch((err) => {
                            reject(new Error(""));
                        });
                })
                .catch((reason) => {
                    reject(new Error(""));
                });
        });
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

    /**
     * Closes the specified file and selects some other file that is open.
     */
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
                    for (const pathToSelect of paths) {
                        const file = this.files.getWeakRef(pathToSelect);
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

    /**
     * The implication is that the specified file should be open and selected.
     * Closes all files exluding the specified file, which becomes open and selected.
     */
    closeOthers(path: string): void {
        if (this.files) {
            const file = this.files.getWeakRef(path);
            if (file) {
                const paths = this.files.keys.filter((fileName) => { return fileName !== path; });
                this.closePaths(paths);
                file.isOpen = true;
                file.selected = true;
                // FIXME: This should emit an event that is throttled that leads to an update of Local Storage.
                this.updateStorage();
            }
        }
    }

    closeAll(): void {
        this.closePaths(this.files.keys);
        // FIXME: This should emit an event that is throttled that leads to an update of Local Storage.
        this.updateStorage();
    }

    private closePaths(paths: string[]): void {
        for (const path of paths) {
            const fileToClose = this.files.getWeakRef(path);
            if (fileToClose.isOpen) {
                fileToClose.isOpen = false;
                fileToClose.selected = false;
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

    //
    // TODO: Determine whether we can make Document an implementation detail.
    //
    /*
    setFileDocument(path: string, doc: Document) {
        if (this.files) {
            const file = this.files.getWeakRef(path);
            if (file) {
                file.setDocument(doc);
            }
        }
    }
    */

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
                allowJs: true,
                checkJs: true,
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
                skipLibCheck: true,
                sourceMap: true,
                strictNullChecks: true,
                suppressImplicitAnyIndexErrors: true,
                target: 'es5',
                traceResolution: true
            };
            const content = stringifyFileContent(configuration);
            return this.ensureFile(TSCONFIG_DOT_JSON, content, false);
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
            return this.ensureFile(TSLINT_DOT_JSON, content, false);
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
        return this.ensureFile(PACKAGE_DOT_JSON, '{}', false);
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
            return this.ensureFile(TYPES_DOT_CONFIG_DOT_JSON, JSON.stringify(settings, null, 4), false);
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
    private ensureFile(path: string, content: string, isExternal: boolean): WsFile {
        if (!this.existsFile(path)) {
            const file = this.newFileUnmonitored(path, isExternal);
            file.setText(content);
            file.mode = modeFromName(path);
            return file;
        }
        else {
            // We know that the file is defined so the cast is appropriate.
            return this.findFileByPath(path) as WsFile;
        }
    }

    /**
     * Moving a file to trash is synchronous.
     */
    private moveFileToTrash(path: string): void {
        if (this.traceFileOperations) {
            this.logLifecycle(`moveFileToTrash(path = "${path}")`);
        }
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
        if (this.traceFileOperations) {
            this.logLifecycle(`trashPut(path = "${path}")`);
        }
        if (this.trash) {
            const placeholder = new WsFile(false, this, this.editorService);
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
        if (this.traceFileOperations) {
            this.logLifecycle(`restoreFromTrash(path = ${path})`);
        }
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
        if (this.traceFileOperations) {
            this.logLifecycle(`subscribeRoomToDocumentChanges(path = "${path}")`);
        }
        // We need the document in order to add the change listener.
        const session = this.getFileSession(path);
        if (session) {
            try {
                if (this.files) {
                    const file = this.files.getWeakRef(path);
                    const unit = file.unit;
                    // When the Document emits delta events they get debounced.
                    // When things go quiet, the unit diffs the file against the shadow to create edits.
                    // The edits are sent to the room (server) via the room agent that acts as a proxy.
                    if (this.room) {
                        const changeHandler = debounce(uploadFileEditsToRoom(path, unit, this.room), SYNCH_DELAY_MILLISECONDS);
                        // TODO: addChangeHandler is deprecated.
                        this.roomDocumentChangeListenerRemovers[path] = session.addChangeListener(changeHandler);
                    }
                }
            }
            finally {
                session.release();
            }
        }
    }

    /**
     * Stop listening to document changes that gives rise to delta edits for the room.
     */
    unsubscribeRoomFromDocumentChanges(path: string): void {
        if (this.traceFileOperations) {
            this.logLifecycle(`unsubscribeRoomFromDocumentChanges(path = "${path}")`);
        }
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

    /**
     * Pushes the delta down to the Language Service then cascades to...
     * 1. Update file session marker models.
     * 2. Update file editor front markers.
     * 3. Requests output files for the specified file.
     * 
     * This is called by the LanguageServiceScriptMonitor in response to Document 'change' events.
     */
    public applyDelta(path: string, delta: Delta): void {
        if (this.traceFileOperations) {
            this.logLifecycle(`applyDelta(path = "${path}")`);
        }
        if (this.languageServiceProxy) {
            this.languageServiceProxy.applyDelta(path, delta, (err: any, version: number) => {
                if (!err) {
                    // Update the model.
                    this.updateFileSessionMarkerModels(path, delta);
                    // Update the view.
                    this.updateFileEditorFrontMarkers(path);

                    // TODO: We request output files
                    // 1. How is a compile initiated?
                    // 2. Do we need the output files anyway?
                    // TODO: How does it perform when we don't request outpit files?
                    // this.outputFilesForPath(path);
                    this.deltaAppliedEventHub.emitAsync(appliedDeltaEventName, { path, delta, version });
                }
                else {
                    console.warn(LANGUAGE_SERVICE_NOT_AVAILABLE);
                }
            });
        }
    }

    /**
     * This appears to be the only function that requires full access to the Editor
     * because it needs to call the updateFrontMarkers method or the Renderer.
     */
    private updateFileSessionMarkerModels(path: string, delta: Delta): void {
        if (this.traceFileOperations) {
            this.logLifecycle(`updateFileSessionMarkerModels(path = "${path}")`);
        }
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
                    // Unexpected action.
                    throw new Error(`updateMarkerModels(${path}, action => ${action} ${JSON.stringify(delta)})`);
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

    /**
     * Schedules an update to all the front markers in the editor renderer.
     * This is like notifying a view that it needs to update itself because a model has changed.
     */
    updateFileEditorFrontMarkers(path: string): void {
        if (this.traceFileOperations) {
            this.logLifecycle(`updateFileEditorFrontMarkers(path = "${path}")`);
        }
        const editor = this.getFileEditor(path);
        if (editor) {
            editor.updateFrontMarkers();
        }
    }

    /**
     *
     */
    getCompletionsAtPosition(path: string, position: number, prefix: string): Promise<CompletionEntry[]> {
        if (this.traceFileOperations) {
            this.logLifecycle(`getCompletionsAtPosition(path = "${path}")`);
        }
        if (this.languageServiceProxy) {
            return this.languageServiceProxy.getCompletionsAtPosition(path, position, prefix);
        }
        else {
            return Promise.reject(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
        }
    }

    /**
     *
     */
    getDefinitionAtPosition(path: string, position: Position): Promise<DefinitionInfo<Position>[]> {
        if (this.traceFileOperations) {
            this.logLifecycle(`getDefinitionAtPosition(path = "${path}")`);
        }
        return new Promise<DefinitionInfo<Position>[]>((resolve, reject) => {
            const session = this.getFileSession(path);
            if (session) {
                if (this.languageServiceProxy) {
                    this.languageServiceProxy.getDefinitionAtPosition(path, session.positionToIndex(position))
                        .then((ds) => {
                            const results = ds.map((d) => {
                                const that: DefinitionInfo<Position> = {
                                    fileName: d.fileName,
                                    textSpan: { start: session.indexToPosition(d.textSpan.start), length: d.textSpan.length },
                                    kind: d.kind,
                                    name: d.name,
                                    containerKind: d.containerKind,
                                    containerName: d.containerName
                                };
                                return that;
                            });
                            resolve(results);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
                else {
                    reject(new Error(LANGUAGE_SERVICE_NOT_AVAILABLE));
                }
                session.release();
            }
            else {
                reject(new Error(`session must exist for file "${path}" for textSpan conversion.`));
            }
        });
    }

    /**
     *
     */
    getFormattingEditsForDocument(path: string, settings: FormatCodeSettings): Promise<TextChange<number>[]> {
        if (this.traceFileOperations) {
            this.logLifecycle(`getFormattingEditsForDocument(path = "${path}")`);
        }
        return new Promise<TextChange<number>[]>((resolve, reject) => {
            if (this.languageServiceProxy) {
                this.languageServiceProxy.getFormattingEditsForDocument(path, settings, (err: any, textChanges: TextChange<number>[]) => {
                    if (!err) {
                        resolve(textChanges);
                    }
                    else {
                        reject(err);
                    }
                });
            }
            else {
                reject(new Error("Formatting edits are not available at this moment."));
            }
        });
    }

    /**
     *
     */
    getQuickInfoAtPosition(path: string, position: number): Promise<QuickInfo> {
        if (this.traceFileOperations) {
            this.logLifecycle(`getQuickInfoAtPosition(path = "${path}")`);
        }
        return new Promise<QuickInfo>((resolve, reject) => {
            if (this.languageServiceProxy) {
                this.languageServiceProxy.getQuickInfoAtPosition(path, position, (err: any, quickInfo: QuickInfo) => {
                    if (!err) {
                        resolve(quickInfo);
                    }
                    else {
                        reject(err);
                    }
                });
            }
            else {
                reject(new Error("QuickInfo is not available at this moment."));
            }
        });
    }
}
